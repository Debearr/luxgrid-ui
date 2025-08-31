# Master Prompt Document - LuxGrid Ecosystem

Complete reference for automated workflows, quality assurance, and development processes.

## Table of Contents

1. [Cursor Shortcuts](#cursor-shortcuts)
2. [VOAI Integration](#voai-integration)
3. [Brand Guidelines](#brand-guidelines)
4. [Quality Assurance](#quality-assurance)
5. [Automation Workflows](#automation-workflows)

---

## Cursor Shortcuts

### Overview
Automated VOAI bucket processing system for Next.js applications with minimal, reversible fixes.

### Command Reference

#### 🔧 Standard Fix Mode
**Purpose**: Full automated fix cycle with PR creation
**Command**:
```txt
Fix Mode: Noidlux Next.js. Consume VOAI buckets ([Console Errors][Network Failures][Accessibility][Performance][Security]) from my next paste. For each item, propose minimal reversible diffs with exact file:line. Apply patches, run `npm run build`, and open PR on branch `cursor/apply-scan-report-patches-and-build` against `main`. Keep changes small; no paraphrasing—stick to the issue text.
```

#### 👀 Dry-Run Mode
**Purpose**: Preview changes without applying them
**Command**:
```txt
Dry-Run Fix Mode: Parse VOAI buckets, generate unified diffs with file:line, but DO NOT write changes. Summarize impact and list the exact `git apply` patch I could run manually. No PR.
```

#### 🔄 Resume Mode
**Purpose**: Continue with additional VOAI results
**Command**:
```txt
Resume Fix Mode: Append new VOAI buckets and continue proposing minimal diffs; re-run `npm run build`. Update the same branch `cursor/apply-scan-report-patches-and-build` and push to the existing PR.
```

#### 🚀 Safe Merge Mode
**Purpose**: Comprehensive checks before merge
**Command**:
```txt
If build and basic checks pass, update PR checklist (console/network/a11y/perf/security), request review, and post build logs. Do NOT auto-merge unless all checks are green and branch is up to date with `main`.
```

#### 🆘 Emergency Rollback
**Purpose**: Quick revert of problematic changes
**Command**:
```txt
Create emergency rollback branch `cursor/revert-latest`, revert the last Cursor PR commit(s), open a rollback PR with title "Revert: Cursor fixes", and include a short diff summary.
```

### VOAI Bucket Processing

#### Supported Issue Types

**Console Errors**
- TypeError fixes with null checks (`obj?.property`)
- ReferenceError resolution
- Deprecated API comments and warnings

**Network Failures**
- Fetch error handling with `.catch()`
- XHR timeout management
- API endpoint validation

**Accessibility**
- Missing alt text for images
- ARIA label additions
- Semantic HTML improvements
- Keyboard navigation fixes

**Performance**
- Next.js Image component optimization
- Lazy loading implementation
- Resource loading optimization
- Bundle size reduction

**Security**
- XSS protection measures
- CORS header implementation
- Input sanitization
- Security header additions

#### Fix Strategies

1. **Minimal Impact**: Only modify the exact lines mentioned
2. **Reversible**: All changes can be easily undone
3. **Contextual**: Fixes respect existing code patterns
4. **Safe**: Build verification before PR creation

---

## VOAI Integration

### Input Format
VOAI buckets should follow this exact format:

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

### Processing Pipeline

1. **Parse**: Extract issues with file:line precision
2. **Categorize**: Sort into appropriate VOAI buckets
3. **Generate**: Create targeted fixes for each issue type
4. **Validate**: Ensure fixes are minimal and reversible
5. **Apply**: Write changes or generate preview diffs
6. **Verify**: Run build and quality checks
7. **Deploy**: Create PR with comprehensive documentation

---

## Brand Guidelines

### LuxGrid DNA
- **Minimalist**: Clean grids, sharp typography, intentional whitespace
- **Luxury**: Subtle gradients, refined shadows, confident interactions
- **Accessible**: WCAG-compliant colors and navigation
- **Emotional**: Seamless animations that evoke elegance
- **Gamified**: Delightful micro-interactions for engagement

### Code Style Requirements
- TypeScript strict mode enabled
- Tailwind CSS for styling consistency
- Component-based architecture
- Accessibility-first design
- Performance optimization by default

---

## Quality Assurance

### Automated Checks
- **Build**: `npm run build` - Next.js compilation
- **Tests**: `npm run test:ci` - Jest test suite
- **Security**: `npm run security:scan` - NPM audit
- **Performance**: `npm run performance:audit` - Lighthouse CI
- **Brand**: `npm run brand:validate` - Brand compliance

### Manual Review Checklist
- [ ] Console errors resolved
- [ ] Network failures handled
- [ ] Accessibility standards met
- [ ] Performance metrics improved
- [ ] Security vulnerabilities addressed
- [ ] Brand guidelines followed
- [ ] Build passes successfully
- [ ] Tests pass
- [ ] No breaking changes introduced

---

## Automation Workflows

### Available Scripts

#### Core Development
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server

#### Quality Assurance  
- `npm run test` - Run test suite
- `npm run test:ci` - CI-optimized tests
- `npm run security:scan` - Security audit
- `npm run performance:audit` - Performance analysis

#### Brand & Council
- `npm run brand:validate` - Brand compliance check
- `npm run council:run` - Council approval workflow
- `npm run automation:status` - Automation health check

#### Emergency
- `npm run rollback` - Emergency rollback utility

### Cursor Integration Commands

#### Quick Setup
```bash
# Make cursor-oneliners executable
chmod +x automation/cursor-oneliners.js

# Test dry-run mode
echo "[Console Errors]\nTest error (src/test.js:1)" > test-voai.txt
node automation/cursor-oneliners.js dry-run test-voai.txt
```

#### Integration with Existing Workflows
The Cursor One-Liners integrate seamlessly with:
- Council approval process
- Brand validation checks
- Performance monitoring
- Security scanning
- Automated testing

---

## Best Practices

### When to Use Each Mode

**Standard Mode**: Regular VOAI report processing
**Dry-Run Mode**: Preview changes before applying
**Resume Mode**: Additional issues found after initial fix
**Safe Merge Mode**: Final checks before deployment
**Rollback Mode**: Emergency situations only

### Workflow Recommendations

1. **Always start with Dry-Run** to preview changes
2. **Use Resume for iterative fixes** when new issues are discovered
3. **Run Safe Merge before requesting reviews**
4. **Keep Emergency Rollback ready** for quick reverts
5. **Integrate with existing automation** for comprehensive quality assurance

### Security Considerations

- All changes are isolated to feature branches
- Build verification prevents broken deployments
- Manual review required before merge
- Emergency rollback available for quick recovery
- Minimal change philosophy reduces risk

---

© 2025 LuxGrid — Automated Excellence Through Minimal Intervention