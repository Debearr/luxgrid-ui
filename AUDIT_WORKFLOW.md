# NOIDLUX AUDIT & FIX WORKFLOW

## Quick Start (Copy/Paste Ready)

### Step 1: Claude Extension Scan Prompt
```
Audit this page: list console errors, 4xx/5xx requests, layout/accessibility issues, and propose fixes. Focus on:

🔴 Console: JavaScript errors, React issues, missing dependencies
🌐 Network: Failed requests, missing resources, API errors  
♿ Accessibility: Alt text, contrast, ARIA labels, keyboard nav
🔍 SEO: Meta tags, headings, Open Graph, schema markup
⚡ Performance: Bundle size, Core Web Vitals, image optimization
🔒 Security: Headers, XSS protection, dependency vulnerabilities

Provide specific line numbers and file references where possible.
```

### Step 2: VOAI Summary Format
When Claude Extension returns results, create this summary:

```
## NOIDLUX AUDIT SUMMARY

### 🔴 Console Errors (Priority 1)
- [List specific errors with file/line references]

### 🌐 Network Issues (Priority 1)  
- [List failed requests and missing resources]

### ♿ Accessibility Issues (Priority 2)
- [List A11y violations with WCAG references]

### 🔍 SEO Issues (Priority 2)
- [List missing meta tags and SEO problems]

### ⚡ Performance Issues (Priority 3)
- [List Core Web Vitals and optimization opportunities]

### 🔒 Security Issues (Priority 4)
- [List security headers and vulnerability concerns]

### Recommended Fix Order:
1. Console/Network (Critical functionality)
2. Accessibility/SEO (User experience)  
3. Performance (Speed optimization)
4. Security (Headers and protection)
```

### Step 3: Cursor Fix Application

Paste the **CURSOR_FIX_PROMPT.md** content first, then paste the VOAI summary.

Cursor will suggest diffs → apply them → run:
```bash
git checkout main && git pull
git checkout -b fix/landing-audit-issues-$(date +%s)
pnpm install && pnpm build && pnpm dev
```

### Step 4: Verification Loop

1. Open Vercel PR Preview link
2. Run Claude Extension again on preview
3. Repeat VOAI → Cursor cycle until issues resolved
4. Each iteration creates new fix branch with timestamp

### Step 5: Final PR

When audit shows minimal issues:
```bash
git add .
git commit -m "fix: resolve landing page audit issues

- Fixed console errors and network issues
- Improved accessibility compliance  
- Enhanced SEO meta tags
- Optimized performance metrics
- Added security headers"

git push origin fix/landing-audit-issues-$(date +%s)
```

## Environment Status

✅ **Repository:** Noidlux Next.js app ready
✅ **Branch:** fix/landing-audit-issues created  
✅ **Dependencies:** pnpm installed successfully
✅ **Build:** Passing (87.3 kB First Load JS)
✅ **Dev Server:** Running on localhost:3000
✅ **Fix Prompt:** CURSOR_FIX_PROMPT.md ready

## Ready for Audit Cycle

The environment is now prepared for the audit → fix → test → repeat cycle.

Next step: Run Claude Extension on https://noidlux.com or the local dev server.