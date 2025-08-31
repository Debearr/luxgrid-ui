# Quick Paste Pack - Cursor One-Liners

Copy-paste ready commands for instant VOAI bucket processing.

## 🔧 Standard Fix Mode
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Accessibility][Performance][Security]) from my next paste. For each item, propose minimal reversible diffs with exact file:line. Apply patches, run `npm run build`, and open PR on branch `cursor/apply-scan-report-patches-and-build` against `main`. Keep changes small; no paraphrasing—stick to the issue text.
```

## 👀 Dry-Run Mode (Preview Only)
```txt
Dry-Run Fix Mode: Parse VOAI buckets, generate unified diffs with file:line, but DO NOT write changes. Summarize impact and list the exact `git apply` patch I could run manually. No PR.
```

## 🔄 Resume/Continue Mode
```txt
Resume Fix Mode: Append new VOAI buckets and continue proposing minimal diffs; re-run `npm run build`. Update the same branch `cursor/apply-scan-report-patches-and-build` and push to the existing PR.
```

## 🚀 Safe Merge+Deploy Mode
```txt
If build and basic checks pass, update PR checklist (console/network/a11y/perf/security), request review, and post build logs. Do NOT auto-merge unless all checks are green and branch is up to date with `main`.
```

## 🆘 Emergency Rollback
```txt
Create emergency rollback branch `cursor/revert-latest`, revert the last Cursor PR commit(s), open a rollback PR with title "Revert: Cursor fixes", and include a short diff summary.
```

---

## Usage Flow

1. **Copy** one of the commands above
2. **Paste** into Cursor
3. **Follow up** with your VOAI bucket data
4. **Watch** as fixes are automatically applied

## Example VOAI Bucket Format

```txt
[Console Errors]
TypeError: Cannot read property 'name' of undefined (src/components/Header.tsx:42)
ReferenceError: process is not defined (src/utils/config.ts:15)

[Network Failures]  
Fetch failed: 500 Internal Server Error (src/api/users.ts:23)
XHR timeout after 5000ms (src/hooks/useData.ts:67)

[Accessibility]
Missing alt text for image (src/components/Gallery.tsx:89)
Button missing aria-label (src/components/Navigation.tsx:156)

[Performance]
Large image not optimized (src/pages/index.tsx:34)
Blocking resource load (src/components/VideoPlayer.tsx:78)

[Security]
Potential XSS in user content (src/components/UserPost.tsx:45)
Missing CORS headers (src/pages/api/upload.ts:12)
```

## CLI Alternative

For power users, you can also use the CLI directly:

```bash
# Standard mode
node automation/cursor-oneliners.js standard voai-report.txt

# Dry run
node automation/cursor-oneliners.js dry-run voai-report.txt

# Resume
node automation/cursor-oneliners.js resume additional-issues.txt

# Safety checks
node automation/cursor-oneliners.js safe-merge

# Rollback
node automation/cursor-oneliners.js rollback
```

---

**🎯 Pro Tips:**
- Always start with **Dry-Run** to preview changes
- Use **Resume** when you get additional VOAI results
- Run **Safe Merge** before requesting PR reviews
- Keep **Emergency Rollback** handy for quick reverts