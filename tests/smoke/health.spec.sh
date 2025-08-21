#!/usr/bin/env bash
set -euo pipefail
URL="${1:-}"
[ -z "$URL" ] && echo "Missing URL" && exit 1
curl -fsS "$URL/health" >/dev/null
echo "Health OK ✅"

