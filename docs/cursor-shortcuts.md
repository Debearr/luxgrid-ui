# Cursor Shortcuts - One-Liner Commands

Plug-and-play **Cursor One-Liners** for automated VOAI bucket processing and Next.js fixes.

## Quick Reference

### 1) Standard Fix Mode
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Accessibility][Performance][Security]) from my next paste. For each item, propose minimal reversible diffs with exact file:line. Apply patches, run `npm run build`, and open PR on branch `cursor/apply-scan-report-patches-and-build` against `main`. Keep changes small; no paraphrasing—stick to the issue text.
```

### 2) Dry-Run Mode (preview only)
```txt
Dry-Run Fix Mode: Parse VOAI buckets, generate unified diffs with file:line, but DO NOT write changes. Summarize impact and list the exact `git apply` patch I could run manually. No PR.
```

### 3) Resume/Continue Mode
```txt
Resume Fix Mode: Append new VOAI buckets and continue proposing minimal diffs; re-run `npm run build`. Update the same branch `cursor/apply-scan-report-patches-and-build` and push to the existing PR.
```

### 4) Safe Merge+Deploy Mode
```txt
If build and basic checks pass, update PR checklist (console/network/a11y/perf/security), request review, and post build logs. Do NOT auto-merge unless all checks are green and branch is up to date with `main`.
```

### 5) Emergency Rollback
```txt
Create emergency rollback branch `cursor/revert-latest`, revert the last Cursor PR commit(s), open a rollback PR with title "Revert: Cursor fixes", and include a short diff summary.
```

## Implementation Details

The automation is powered by `/automation/cursor-oneliners.js` which provides:

### VOAI Bucket Processing
- **Console Errors**: Null checks, deprecated usage comments
- **Network Failures**: Error handling for fetch/XHR calls  
- **Accessibility**: Alt text, ARIA labels, semantic HTML
- **Performance**: Image optimization, lazy loading, Next.js Image component
- **Security**: XSS protection, security headers, input sanitization

### Git Workflow
- Automatic branch management (`cursor/apply-scan-report-patches-and-build`)
- Minimal reversible diffs with exact file:line targeting
- Build verification before PR creation
- Rollback capability for emergency situations

### Usage Examples

#### CLI Usage
```bash
# Standard mode with VOAI report
node automation/cursor-oneliners.js standard voai-report.txt

# Dry run to preview changes
node automation/cursor-oneliners.js dry-run voai-report.txt

# Resume with additional issues
node automation/cursor-oneliners.js resume more-issues.txt

# Run safety checks
node automation/cursor-oneliners.js safe-merge

# Emergency rollback
node automation/cursor-oneliners.js rollback
```

#### VOAI Input Format
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

## Workflow Steps

1. **Parse**: Extract issues from VOAI buckets with file:line precision
2. **Generate**: Create minimal, reversible diffs for each issue
3. **Apply**: Write changes to files (or preview in dry-run mode)
4. **Build**: Run `npm run build` to verify changes don't break the app
5. **Git**: Create/update branch and PR with detailed commit message
6. **Verify**: Run comprehensive checks (tests, security, performance)
7. **Review**: Manual review required before merge

## Safety Features

- **Minimal Changes**: Only touches the exact lines mentioned in VOAI reports
- **Reversible Diffs**: All changes can be easily reverted
- **Build Verification**: Ensures changes don't break the application
- **Branch Isolation**: All changes happen on feature branches
- **Emergency Rollback**: Quick revert capability for problematic changes

## Integration with Existing Automation

Works alongside existing automation scripts:
- `npm run security:scan` - Security audit integration
- `npm run performance:audit` - Lighthouse CI integration  
- `npm run brand:validate` - Brand consistency checks
- `npm run council:run` - Council approval workflow

---

**Pro Tip**: Start with Dry-Run mode to preview changes, then use Standard mode to apply them. Use Resume mode when you get additional VOAI results later.