# Quick Paste Pack — Noidlux Fix Session Workflow

**Version:** 1.0  
**Date:** 2025-01-27  
**Purpose:** Copy-paste ready prompts for the complete Extension → VOAI → Cursor → Claude Code workflow

---

## 🔄 Complete Workflow Overview

1. **Claude Extension** → run Fix Session Starter Prompt → returns raw scan
2. **VOAI** → apply formatting template with headers → clean, parseable buckets  
3. **Cursor** → paste Fix Prompt + VOAI's output → generates safe file+line fixes and opens PR
4. **Claude Code (4PM)** → picks up PR, merges, validates, deploys

---

## 📋 Section 1: VOAI Formatting Template

### Copy-Paste for VOAI:

```plaintext
Format this raw scan data into clean buckets with these exact headers:

[Console Errors]
- List each console error with file/line references
- Include error messages and stack traces
- Prioritize by severity (critical → warning)

[Network Failures]  
- Failed requests with status codes
- Timeout issues
- CORS problems
- API endpoint failures

[Accessibility]
- Missing alt text, ARIA labels
- Color contrast violations  
- Keyboard navigation issues
- Screen reader problems

[Performance]
- Large bundle sizes
- Slow loading resources
- Memory leaks
- Render blocking issues

[Security]
- XSS vulnerabilities
- Exposed credentials
- Insecure dependencies
- HTTPS/CSP violations

Keep descriptions concise. Include file paths and line numbers where available.
```

---

## 🔧 Section 2: Cursor Fix Prompt

### Copy-Paste for Cursor:

```plaintext
You are in FIX MODE for the Noidlux Next.js repo.

I will paste results from VOAI. They are structured into buckets:
[Console Errors]
[Network Failures]
[Accessibility]
[Performance]
[Security]

For each bucket:
1. Propose minimal, reversible Next.js patches (with exact file + line refs).
2. Keep changes small, safe, and reversible.
3. Use diffs format where possible.
4. Do not paraphrase — stay literal to the issue.

After proposing patches:
- Validate with `npm run build`
- Confirm build passes
- Commit fixes to branch: cursor/apply-scan-report-patches-and-build
- Push PR against `main`
```

---

## 🎯 Section 3: Usage Instructions

### Step-by-Step Process:

1. **Start with Claude Extension**
   - Run the Fix Session Starter Prompt
   - Copy the raw scan output

2. **Format with VOAI**
   - Paste Section 1 template into VOAI
   - Include the raw scan data
   - Copy the formatted bucket output

3. **Fix with Cursor**
   - Paste Section 2 prompt into Cursor
   - Include the VOAI formatted buckets
   - Let Cursor generate and apply fixes

4. **Deploy with Claude Code**
   - Claude Code automatically picks up the PR
   - Validates, merges, and deploys

---

## ⚡ Benefits of This Modular Approach

- **Claude Extension** = Scanner (comprehensive issue detection)
- **VOAI** = Formatter (clean, parseable structure)  
- **Cursor** = Mechanic (safe, targeted fixes)
- **Claude Code** = Orchestrator (automated deployment)

Each tool has a specific role, making the workflow reliable and maintainable.

---

## 🚀 Quick Reference

| Tool | Purpose | Input | Output |
|------|---------|-------|--------|
| Claude Extension | Scan for issues | Codebase | Raw scan data |
| VOAI | Format data | Raw scan + template | Structured buckets |
| Cursor | Generate fixes | Buckets + fix prompt | PR with patches |
| Claude Code | Deploy | PR | Live deployment |

---

**Last Updated:** 2025-01-27  
**Workflow Status:** ✅ Ready for Production Use