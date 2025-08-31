# NØID Quick Paste Pack

Ultra-condensed commands for rapid multi-agent workflow execution.

## ■ Instant Commands

### Claude Extension Audit
```
Audit this page: list console errors, 4xx/5xx requests, layout/accessibility issues, and propose minimal Next.js fixes with file+line references.
```

### VOAI Format
```
Format Extension results using the Scan Template.
```

### Cursor Apply
```
Apply patches from formatted scan results (Console, Network, Perf, A11y, Security). Keep changes minimal, reversible, and aligned with Next.js best practices.
```

### Claude Code Orchestrate
```
Parse VOAI formatted results → generate Next.js patches with file+line refs → guide git workflow → validate builds → deploy to Vercel → re-scan preview.
```

## ■ Git One-Liners

### Fix Branch
```bash
git checkout -b fix/scan-issues && git add -A && git commit -m "Fix: audit scan issues" && git push -u origin fix/scan-issues && gh pr create --fill --base main --title "Fix: audit issues" --body "Fixes from Extension/VOAI scan reports"
```

### Build & Deploy
```bash
npm run build && vercel --prod
```

### Emergency Rollback
```bash
npm run rollback
```

## ■ VOAI Template (Copy-Ready)

```
## ■ Console Errors
- 

## ■ Network Issues
- 

## ■ Performance
- Perf: __/100 • A11y: __/100 • SEO: __/100
- LCP: __s • CLS: __ • TBT: __ms
- Issues: 

## ■ Accessibility
- Score: __/100
- Issues: 

## ■ Security
- 
```

## ■ Debrief Template (4PM Paste)

```
You are rejoining the NØID/Noidlux workflow in FIX MODE.
Current Status:
- Claude Extension: Workflow validated. Awaiting real scan results.
- VOAI: Formats raw Extension results into structured buckets.
- Cursor: Running luxgrid-ui repo, ~70% fixes done (Next.js configs, token structure, builds stable).
Your Tasks:
1. Parse VOAI scan results.
2. Generate minimal, reversible Next.js patches (file+line refs).
3. Git workflow: [see Git One-Liners above]
4. Validate (npm run build).
5. Deploy → re-scan → merge clean build.
```

---
**Quick Access**: Pin this file for instant copy-paste during agent handoffs.