## One-Click VC Pipeline Prompt (Evidence-Driven, Executable)

You are evaluating this repository for VC readiness. Produce an evidence-backed review and an ROI-ranked execution plan that a developer can implement immediately. Cite concrete files and line ranges for all findings. Avoid generic advice.

Output Requirements:
- Return a single JSON object conforming to `docs/oneclick-vc-output.schema.json`.
- Validate your JSON against the schema before returning. If invalid, fix it.

### 2) Detailed VC Review (Evidence-Required)
- Architecture & Performance
  - Found: [files/patterns showing architectural decisions]
  - Missing: [files/patterns that should exist but do not]
  - Score Justification: [direct code references: `path/to/file.ts:L42-L75` with quotes of key lines]
- Security & Compliance
  - Found: [...]
  - Missing: [...]
  - Score Justification: [...]
- Product & UX
  - Found: [...]
  - Missing: [...]
  - Score Justification: [...]
- Team & Execution
  - Found: [...]
  - Missing: [...]
  - Score Justification: [...]
- Go-to-Market & Economics
  - Found: [...]
  - Missing: [...]
  - Score Justification: [...]

Provide numeric scores (0-10) for each area with justification tied to specific code references. No assumptions.

### 5) Execution Plan (ROI-ranked, not calendar-ranked)
- Immediate (Day 1-3): Highest ROI / lowest effort items
  - Item: [change], File(s): [`path/file.ts:line`], Expected ROI: [revenue or cost impact], Effort: [1-5], Risk: [Low/Med/High], ETA: [specific date or N business days]
- Sprint 1 (Week 1-2): Core functionality gaps that block demos
  - Item: [...]
- Sprint 2 (Week 3-4): Scalability and performance optimizations
  - Item: [...]
- Future (Month 2+): Enterprise features and advanced capabilities
  - Item: [...]

For every item: include Expected ROI, Effort Score (1-5), Risk Level, explicit ETA, and acceptance criteria.

### 7) Validation & Launch Gate (Executable Checklist)
- Performance: `npm run perf-test` should show p95 < 200ms
- Security: `npm audit --audit-level high` returns 0 vulnerabilities
- Build: `npm run build && npm run test` passes with >80% coverage
- Deploy: Staging deploy + smoke test + rollback test all green

Go/No-Go Decision Matrix:
- All High priority items: MUST be complete
- 80%+ Medium priority: SHOULD be complete
- Low priority: CAN be deferred to post-launch

### 8.5) Stakeholder Deliverables
- For Developers: Top 5 code TODOs with file paths + exact line numbers
- For Product: Feature gaps ranked by user impact
- For Investors: Demo script with "wow moments" + competitive advantages
- For Operations: Deployment/monitoring readiness checklist

### Self-Validation Checkpoint (REQUIRED)
Before returning your final response, verify:
- [ ] Every score has supporting evidence from the codebase
- [ ] All execution items have specific ETAs (not "1-2 weeks")
- [ ] JSON validates against the schema (test it)
- [ ] At least 3 concrete code/config changes mentioned per gap
- [ ] No generic advice (e.g., say "add rate limiting to `api/auth.ts:L45`" instead of "improve security")

### QUALITY ENFORCEMENT (MANDATORY)
Your response will be validated against these criteria:
1. Specificity Test: Can a developer implement your suggestions without asking clarifying questions?
2. Evidence Test: Is every score backed by specific code references?
3. Measurability Test: Can progress be tracked with clear metrics?
4. Actionability Test: Are next steps concrete (file names, function signatures, config values)?

If your response fails any test, revise before submitting.
