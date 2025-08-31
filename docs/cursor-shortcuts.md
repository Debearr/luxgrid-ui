# Cursor One-Liners for VOAI Scan Reports

Plug-and-play **Cursor One-Liners** for processing VOAI (Visual, Operational, Accessibility, Infrastructure) scan reports without pasting the full Fix Prompt every time.

## Quick Reference Commands

### 1) Standard Fix Mode
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Accessibility][Performance][Security]) from my next paste. For each item, propose minimal reversible diffs with exact file:line. Apply patches, run `npm run build`, and open PR on branch `cursor/apply-scan-report-patches-and-build` against `main`. Keep changes small; no paraphrasing—stick to the issue text.
```

**Use when:** You have VOAI scan results and want automated fixes with PR creation.

### 2) Dry-Run Mode (Preview Only)
```txt
Dry-Run Fix Mode: Parse VOAI buckets, generate unified diffs with file:line, but DO NOT write changes. Summarize impact and list the exact `git apply` patch I could run manually. No PR.
```

**Use when:** You want to preview proposed changes before applying them.

### 3) Resume/Continue Mode
```txt
Resume Fix Mode: Append new VOAI buckets and continue proposing minimal diffs; re-run `npm run build`. Update the same branch `cursor/apply-scan-report-patches-and-build` and push to the existing PR.
```

**Use when:** You have additional VOAI results to process after initial fixes.

### 4) Safe Merge+Deploy
```txt
If build and basic checks pass, update PR checklist (console/network/a11y/perf/security), request review, and post build logs. Do NOT auto-merge unless all checks are green and branch is up to date with `main`.
```

**Use when:** Ready to finalize and merge after reviewing changes.

### 5) Emergency Rollback
```txt
Create emergency rollback branch `cursor/revert-latest`, revert the last Cursor PR commit(s), open a rollback PR with title "Revert: Cursor fixes", and include a short diff summary.
```

**Use when:** Need to quickly revert problematic changes.

## Workflow

1. **Scan & Paste**: Run your VOAI scan and paste the formatted bucket results
2. **Choose Mode**: Use Standard Fix Mode (#1) or Dry-Run (#2) for preview
3. **Iterate**: Use Resume Mode (#3) for additional scan results
4. **Finalize**: Use Safe Merge+Deploy (#4) when ready
5. **Rollback**: Use Emergency Rollback (#5) if issues arise

## VOAI Bucket Format Expected

The commands expect VOAI results in this format:
```
[Console Errors]
- Error description with file:line references

[Network Failures]
- Network issue details

[Accessibility]
- A11y violations with specific elements

[Performance]
- Performance bottlenecks and recommendations

[Security]
- Security vulnerabilities and fixes
```

## Project Compatibility

These commands are optimized for:
- **Next.js projects** with `npm run build`
- **Git-based workflows** with PR automation
- **Branch naming**: `cursor/apply-scan-report-patches-and-build`
- **Target branch**: `main`

## Safety Features

- **Minimal diffs**: Changes are kept small and reversible
- **Build validation**: `npm run build` runs after patches
- **PR workflow**: Changes go through pull request review
- **Rollback option**: Emergency revert capability included
- **No auto-merge**: Manual review required before merging

## Notes

- Commands stick to exact issue text without paraphrasing
- File:line references must be exact for proper targeting
- Build must pass before PR finalization
- All changes are tracked through Git for full auditability