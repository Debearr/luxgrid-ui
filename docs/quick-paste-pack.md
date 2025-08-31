# 🖇️ Quick Paste Pack — Cursor Dual-Agent

**Ready-to-use prompts for instant Cursor workflow activation**

---

## 🔧 Fix Mode (Primary Agent)

### Full Command
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Performance][Accessibility][Security]). For each item propose minimal, reversible diffs with exact file:line. After proposing, run `npm ci || pnpm i || yarn` then `npm run build`. Open a PR from branch `cursor/apply-scan-report-patches-and-build` against `main` and post build logs in the PR.
```

### One-Liner Shortcut
```txt
Cursor — apply VOAI buckets as minimal diffs + build + PR.
```

**When to use:**
- ✅ You want automatic PR creation
- ✅ Build validation with logs
- ✅ Direct application of fixes
- ✅ Live deployment pipeline

---

## 👁️ Dry-Run Mode (Secondary Agent)

### Full Command
```txt
Dry-Run Fix Mode: Parse VOAI buckets and output unified diffs with file:line, but DO NOT write. Summarize impact and list the exact `git apply --3way` patch I could run manually. No PR.
```

### One-Liner Shortcut
```txt
Cursor — preview VOAI buckets as diffs only, no PR.
```

**When to use:**
- ✅ Preview changes safely
- ✅ Impact analysis before patching
- ✅ Manual control over application
- ✅ Risk assessment and validation

---

## 🎯 VOAI Bucket Reference

### Input Format
Paste your VOAI scan results in this format:

```
[Console Errors]
- TypeError: Cannot read property 'map' of undefined (src/components/Grid.tsx:42)
- ReferenceError: process is not defined (src/utils/config.ts:15)

[Network Failures]  
- Failed to fetch /api/users (timeout after 5s)
- 404 on /static/icons/missing.svg

[Performance]
- LCP: 4.2s (target: <2.5s) — large image loading
- CLS: 0.25 (target: <0.1) — layout shift on font load

[Accessibility]
- Missing alt text on hero image
- Button lacks aria-label for screen readers
- Color contrast 2.1:1 (needs 4.5:1 for WCAG AA)

[Security]
- XSS vulnerability in user input sanitization
- Outdated dependency: lodash@4.17.20 (CVE-2021-23337)
```

---

## ⚡ Speed Commands

Copy these for instant activation:

### Quick Fix Pipeline
```txt
Cursor — apply VOAI buckets as minimal diffs + build + PR.
```

### Safe Preview Mode  
```txt
Cursor — preview VOAI buckets as diffs only, no PR.
```

### Emergency Security Patch
```txt
Fix Mode: Security-only VOAI buckets. Apply patches + emergency build + fast-track PR with security label.
```

### Performance Focus
```txt
Fix Mode: Performance VOAI buckets only. Apply optimizations + bundle analysis + performance PR.
```

---

## 🔄 Dual-Agent Workflow

### Step-by-Step Process

1. **Prepare VOAI buckets** → format scan results
2. **Launch Agent 2 (Dry-Run)** → get preview + impact analysis  
3. **Launch Agent 1 (Fix Mode)** → apply changes + create PR
4. **Cross-validate** → compare Agent 2 preview with Agent 1 actual changes
5. **Review PR** → check build logs + automated tests
6. **Merge or iterate** → based on validation results

### Parallel Execution Benefits

- 🚀 **Speed:** Both agents work simultaneously
- 🛡️ **Safety:** Dry-run validates before live changes
- 📊 **Visibility:** Full impact analysis + live implementation
- 🔄 **Reversibility:** All changes tracked with exact diffs

---

## 🎨 Brand Integration

### AuraFX × NØID Standards
- **Typography:** Inter font family, 16px base, 1.6 line-height
- **Colors:** Brand-validated palette with WCAG AA+ contrast
- **Motion:** Respect `prefers-reduced-motion`, 200ms transitions
- **Spacing:** 8px grid system, consistent component padding

### Brand Validation
```bash
npm run brand-check  # Validates against brand guidelines
```

---

## 📈 Success Metrics

### Performance KPIs
- **Council→Live:** ≤ 5 min
- **Fix application:** ≤ 2 min
- **Build + deploy:** ≤ 3 min
- **Rollback time:** ≤ 2 min

### Quality Metrics
- **Test coverage:** ≥ 90%
- **Lighthouse score:** ≥ 90
- **Accessibility:** WCAG AA+ compliance
- **Security:** 0 high/critical vulnerabilities

---

*Ready to paste and execute — optimized for speed + safety* ⚡