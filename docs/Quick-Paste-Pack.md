# Quick Paste Pack - Noidlux Fix Workflow

## 🔄 Complete Workflow Chain

**Extension → VOAI → Cursor → Claude Code**

1. **Claude Extension** = Scanner (runs Fix Session Starter Prompt)
2. **VOAI** = Formatter (applies bucket template)  
3. **Cursor** = Mechanic (generates file+line fixes)
4. **Claude Code** = Orchestrator (merges, validates, deploys)

---

## 📋 1. Fix Session Starter Prompt (Claude Extension)

```plaintext
You are conducting a comprehensive web application audit for the Noidlux Next.js repo.

Scan for these critical issues:

**Console Errors:**
- JavaScript runtime errors
- React hydration mismatches
- Missing dependencies
- Type errors in browser console

**Network Failures:**
- Failed API calls (4xx, 5xx responses)
- Missing static assets (images, fonts, CSS)
- CORS issues
- Timeout errors

**Accessibility:**
- Missing alt text on images
- Poor color contrast (WCAG violations)
- Missing ARIA labels
- Keyboard navigation issues
- Screen reader compatibility

**Performance:**
- Large bundle sizes
- Unoptimized images
- Blocking resources
- Memory leaks
- Slow page load times

**Security:**
- XSS vulnerabilities
- Exposed API keys
- Insecure HTTP requests
- Missing CSP headers

For each issue found:
1. Provide exact file path + line number
2. Show the problematic code snippet
3. Explain the impact
4. Suggest specific fix

Be thorough but focus on actionable, high-impact issues.
```

---

## 🎯 2. VOAI Formatting Template

```plaintext
Take the raw scan results and organize them into these exact bucket headers:

[Console Errors]
- List each JavaScript/React error with file:line
- Include error message and impact

[Network Failures]  
- List failed requests with status codes
- Include file paths where requests originate

[Accessibility]
- List WCAG violations with specific elements
- Include file:line references for each issue

[Performance]
- List optimization opportunities with metrics
- Include file paths for large assets/bundles

[Security]
- List vulnerabilities with severity levels
- Include file:line for each security issue

Format each item as:
• **Issue**: Brief description
  - **File**: path/to/file.js:123
  - **Impact**: User-facing consequence
  - **Fix**: Specific action needed

Keep descriptions concise and actionable. Focus on file+line precision.
```

---

## 🔧 3. Cursor Fix Prompt (copy-paste ready)

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

## 📊 4. Usage Flow

### Step 1: Claude Extension
- Paste **Fix Session Starter Prompt**
- Run comprehensive scan
- Get raw results

### Step 2: VOAI  
- Paste **VOAI Formatting Template** + raw scan results
- Get organized buckets with file:line precision

### Step 3: Cursor
- Paste **Cursor Fix Prompt** + VOAI formatted buckets
- Cursor generates patches and opens PR

### Step 4: Claude Code (4PM)
- Picks up PR automatically
- Merges, validates, deploys

---

## ⚡ Key Benefits

- **Modular**: Each tool has one clear job
- **Traceable**: File+line precision throughout
- **Safe**: Minimal, reversible patches only
- **Automated**: PR creation and deployment
- **Fast**: Parallel processing, no context switching

---

## 🎯 Success Criteria

✅ All console errors cleared  
✅ Network requests succeed  
✅ WCAG AA compliance achieved  
✅ Performance scores >90  
✅ Security vulnerabilities patched  
✅ Build passes without warnings  
✅ PR merged and deployed successfully

---

*Generated for Noidlux Next.js workflow optimization*