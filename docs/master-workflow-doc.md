# 🚀 Master Workflow Documentation — AuraFX × NØID

**Version:** 2.1  
**Updated:** 2025-01-27  
**Status:** Active  

## 📋 Overview

Comprehensive workflow documentation for the AuraFX × NØID zero-touch deployment system, including AI Council automation, Cursor dual-agent workflows, and quick-paste productivity tools.

---

## 🖇️ Quick Paste Pack — Cursor Dual-Agent

### 🔧 Cursor Agent 1 — Fix Mode (Primary)

**Full Command:**
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Performance][Accessibility][Security]). For each item propose minimal, reversible diffs with exact file:line. After proposing, run `npm ci || pnpm i || yarn` then `npm run build`. Open a PR from branch `cursor/apply-scan-report-patches-and-build` against `main` and post build logs in the PR.
```

**One-Liner Shortcut:**
```txt
Cursor — apply VOAI buckets as minimal diffs + build + PR.
```

✅ **Use this when you want:**
- Automatic PR creation
- Build validation logs posted  
- Reversible diffs applied directly
- Live deployment pipeline

---

### 👁️ Cursor Agent 2 — Dry-Run Mode (Secondary)

**Full Command:**
```txt
Dry-Run Fix Mode: Parse VOAI buckets and output unified diffs with file:line, but DO NOT write. Summarize impact and list the exact `git apply --3way` patch I could run manually. No PR.
```

**One-Liner Shortcut:**
```txt
Cursor — preview VOAI buckets as diffs only, no PR.
```

✅ **Use this when you want:**
- Preview diffs only (safe sandbox)
- Impact analysis before patching
- Manual patch application
- Risk assessment

---

## 🔀 Dual-Agent Strategy

### Parallel Execution Model

1. **Agent 1 (Fix Mode)** = mechanic that applies patches + PRs
2. **Agent 2 (Dry-Run)** = safety inspector that previews changes

### Workflow Steps

1. **Paste VOAI buckets into Agent 1** → creates live PR with build validation
2. **Paste VOAI buckets into Agent 2** → produces diff preview for cross-check
3. **Compare outputs** → validate consistency and safety
4. **Merge or iterate** → based on validation results

---

## 🏗️ AI Council Integration

### Council Workflow
- **Triggers:** schedule q6h, push on develop, repository_dispatch:council-run-requested, manual
- **Council Seats:** 5 agents → JSON reports + consolidated MD artifact
- **Quality Gates:** tests, security (npm audit high), perf budgets (CWV/Lighthouse), brand-validator

### VOAI Bucket Categories
- **[Console Errors]** → JavaScript runtime issues
- **[Network Failures]** → API/fetch failures, timeouts
- **[Performance]** → Core Web Vitals, bundle size, render performance
- **[Accessibility]** → WCAG AA+ compliance, ARIA, keyboard nav
- **[Security]** → Vulnerabilities, XSS, CSRF, dependency issues

---

## 📊 Quality Gates & KPIs

### Performance Targets
- **Council→Live:** ≤ 5 min
- **Fail-to-rollback:** ≤ 2 min  
- **Manual interventions:** 0/week
- **Error auto-resolution:** < 5 min

### Build Validation
- **Tests:** All unit/integration tests pass
- **Security:** npm audit high vulnerabilities = 0
- **Performance:** Lighthouse ≥ 90, LCP ≤ 2.0s, CLS ≤ 0.1
- **Brand:** Brand-validator compliance

### Post-Deploy Validation
- **/health endpoint:** 200 response
- **Lighthouse scores:** ≥ 90 across all metrics
- **Core Web Vitals:** LCP ≤ 2.0s, CLS ≤ 0.1
- **Auto-rollback:** Triggered on validation failure

---

## 🛠️ Feature Flags

Configuration via `.council/manifest.json`:

```json
{
  "BRAND_VALIDATION": true,
  "ZERO_TOUCH_DEPLOY": true,
  "ROLLBACK_ON_FAIL": true,
  "PERF_BUDGETS_ENFORCED": true,
  "CURSOR_DUAL_AGENT": true
}
```

---

## 📁 Documentation Structure

```
docs/
├── master-workflow-doc.md          # This file — comprehensive workflow guide
├── quick-paste-pack.md             # Ready-to-use Cursor prompts
├── cursor-agent-templates.md       # Extended template library
├── prd-ai-council-perplexity.md    # Research findings
└── docs/
    └── prd-ai-council-copilot.md   # Implementation plan
```

---

## 🔗 Cross-References

- **Main PRD:** [PRD.md](../PRD.md)
- **Perplexity Research:** [prd-ai-council-perplexity.md](./prd-ai-council-perplexity.md)
- **Copilot Implementation:** [docs/prd-ai-council-copilot.md](./docs/prd-ai-council-copilot.md)
- **Quick Paste Pack:** [quick-paste-pack.md](./quick-paste-pack.md)
- **Cursor Agent Templates:** [cursor-agent-templates.md](./cursor-agent-templates.md)

---

## 🎯 Usage Examples

### Scenario 1: Critical Bug Fix
1. **Agent 2 (Dry-Run):** Preview impact → assess risk
2. **Agent 1 (Fix Mode):** Apply patches → auto-deploy if safe
3. **Monitor:** Post-deploy validation → rollback if needed

### Scenario 2: Performance Optimization  
1. **Agent 1 (Fix Mode):** Apply VOAI performance fixes
2. **Agent 2 (Dry-Run):** Cross-validate changes
3. **Council:** Automated performance testing
4. **Deploy:** Auto-merge on quality gate pass

### Scenario 3: Security Patch
1. **Agent 2 (Dry-Run):** Security impact analysis
2. **Agent 1 (Fix Mode):** Apply security patches
3. **Validation:** npm audit + security scan
4. **Emergency Deploy:** Fast-track if critical

---

*Last updated: 2025-01-27 — Ready for production deployment* ✅