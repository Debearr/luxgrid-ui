#!/usr/bin/env bash
set -euo pipefail

URL="${1:-}"
[ -z "$URL" ] && echo "Missing URL" && exit 1

workdir="$(mktemp -d)"
trap 'rm -rf "$workdir"' EXIT

info() { echo "[info] $*"; }
fail() { echo "[fail] $*"; }
pass() { echo "[pass] $*"; }

# Normalize URL (strip trailing slash)
URL="${URL%/}"

status_code() {
	curl -s -o /dev/null -w "%{http_code}" "$1"
}

fetch() {
	curl -sS -L "$1"
}

RESULTS=()
FAILED=0

# 1) GET /
info "Checking $URL/"
code=$(status_code "$URL/")
if [[ "$code" =~ ^2|3 ]]; then
	pass "/ returns $code"
	fetch "$URL/" > "$workdir/index.html"
	if [ ! -s "$workdir/index.html" ] || ! grep -qi "<body" "$workdir/index.html"; then
		fail "Landing page appears blank or missing <body>"
		FAILED=1
	else
		pass "Landing page HTML present"
	fi
else
	fail "/ returned $code"
	FAILED=1
fi

# 2) GET /api/health
info "Checking $URL/api/health"
health_code=$(status_code "$URL/api/health")
health_body=$(fetch "$URL/api/health" || true)
if [[ "$health_code" =~ ^2|3 ]] && echo "$health_body" | jq -e '.status=="ok"' >/dev/null 2>&1; then
	pass "/api/health OK"
else
	fail "/api/health failed (code=$health_code, body=$health_body)"
	FAILED=1
fi

# 3) Assets: CSS/JS/Images
assets_file="$workdir/assets.txt"
awk 'BEGIN{RS="[\"\'\"]"} /\.css$|\.js$|\.png$|\.jpg$|\.jpeg$|\.svg$|\.webp$|\.woff2?$|\.ttf$|\.otf$/{print prev$0}{prev=$0}' "$workdir/index.html" | sort -u > "$assets_file" || true

build_abs() {
	local path="$1"
	if [[ "$path" =~ ^https?:// ]]; then echo "$path"; return; fi
	if [[ "$path" =~ ^// ]]; then echo "https:${path}"; return; fi
	if [[ "$path" =~ ^/ ]]; then echo "${URL}${path}"; return; fi
	echo "${URL}/$path"
}

css_count=0; js_count=0; ok_assets=0; bad_assets=0
while IFS= read -r ref; do
	[ -z "$ref" ] && continue
	abs="$(build_abs "$ref")"
	code=$(status_code "$abs")
	case "$ref" in
		*.css) ((css_count++));;
		*.js) ((js_count++));;
	esac
	if [[ "$code" =~ ^2|3 ]]; then ((ok_assets++)); else
		fail "Asset $abs -> $code"
		((bad_assets++))
	fi
	# limit to checking first 20 assets for speed
	if (( ok_assets + bad_assets >= 20 )); then break; fi
done < "$assets_file"

if (( css_count == 0 )); then
	fail "No CSS assets referenced on landing page"
	FAILED=1
fi
if (( bad_assets > 0 )); then
	fail "$bad_assets asset(s) failed to load"
	FAILED=1
else
	pass "Assets load check passed (sample)"
fi

# 4) Routes
for route in "/dashboard" "/founder"; do
	code=$(status_code "$URL${route}")
	if [[ "$code" =~ ^2|3 ]]; then
		pass "${route} -> $code"
	else
		fail "${route} -> $code"
		FAILED=1
	fi
done

# 5) Console errors using Playwright in isolated temp dir
info "Checking console errors with Playwright"
play_dir="$workdir/play"
mkdir -p "$play_dir"
(
	cd "$play_dir"
	npm init -y >/dev/null 2>&1
	npm i --silent playwright@1.47.2 >/dev/null 2>&1
	npx playwright install --with-deps >/dev/null 2>&1
	node - <<'NODE'
const { chromium } = require('playwright');
(async () => {
	const url = process.env.SMOKE_URL;
	const browser = await chromium.launch();
	const page = await browser.newPage();
	const errors = [];
	const failed = [];
	page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
	page.on('requestfailed', req => { const f = req.failure(); failed.push(`${req.url()} :: ${f && f.errorText}`); });
	await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
	await page.waitForTimeout(1000);
	await browser.close();
	const result = { consoleErrors: errors, failedRequests: failed };
	if (errors.length || failed.length) {
		console.log(JSON.stringify(result));
		process.exit(2);
	}
	console.log(JSON.stringify(result));
	process.exit(0);
})().catch(err => { console.error(String(err)); process.exit(3); });
NODE
) SMOKE_URL="$URL/" || true

node_status=$?
if [ "$node_status" -eq 0 ]; then
	pass "No console errors or failed requests"
else
	fail "Console or network errors detected"
	FAILED=1
fi

# Report
if [ "$FAILED" -ne 0 ]; then
	echo "SMOKE_FAIL"
	exit 1
else
	echo "SMOKE_PASS"
	exit 0
fi