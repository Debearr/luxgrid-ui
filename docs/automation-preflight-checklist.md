# Automation Safety: Pre-Flight Checklist

This checklist helps prevent unintended side effects when running automations, migrations, or batch jobs. Use it before every run, and keep it with your runbook.

---

## TL;DR — Quick Checks
- [ ] Dry-run shows expected changes only
- [ ] Scope is correct (env, tenants, projects, resource IDs)
- [ ] Backups/snapshots exist and restore is tested
- [ ] Rollback plan is defined and feasible
- [ ] Idempotency verified; safe to re-run
- [ ] Rate limits, concurrency, and quotas configured
- [ ] Least-privilege credentials; tokens not expiring mid-run
- [ ] Secrets pulled from a secure store; none hardcoded
- [ ] Approvals recorded (ticket/issue link)
- [ ] Monitoring, structured logs, and alerts wired
- [ ] Kill switch ready (flag/env/command)
- [ ] Maintenance window confirmed; comms prepared
- [ ] Cost impact estimated and guardrails set

---

## Before: Plan and Validate
- **Scope & Targeting**
  - [ ] Environment selected explicitly (e.g., `STAGING`, `PROD`)
  - [ ] Positive allowlists used; avoid broad wildcards
  - [ ] Resource selection query reviewed on a small sample
- **Change Management**
  - [ ] Change record created with owner, purpose, rollback, and success criteria
  - [ ] Risk level and blast radius documented
  - [ ] Stakeholders and on-call informed; comms plan drafted
- **Safety Controls**
  - [ ] Dry-run outputs captured and reviewed by a second person
  - [ ] Idempotency confirmed; side-effect protections in place
  - [ ] Concurrency limits and rate limiting tuned; exponential backoff for retries
  - [ ] Circuit breaker/abort conditions defined (e.g., error rate, latency, cost)
  - [ ] Feature flag or env toggle acts as a kill switch
- **Data Protection & Compliance**
  - [ ] PII/PHI handling reviewed; masking where possible
  - [ ] Backups or snapshots ready; restore path validated
  - [ ] Legal/regulatory checks as applicable (e.g., retention, residency)
- **Readiness & Testing**
  - [ ] Run on staging or a shadow dataset first
  - [ ] Canary on <5% of scope; validate outcomes
  - [ ] Version pinning and dependency locks applied
  - [ ] Configuration captured (inputs, flags, versions)
  - [ ] Code and plan reviewed by peer/approver

---

## During: Execute with Guardrails
- **Progressive Rollout**
  - [ ] Start with canary batch; increase gradually
  - [ ] Pause/resume supported; partial batches safe
- **Observability & Control**
  - [ ] Structured logs with correlation IDs
  - [ ] Live metrics: throughput, success/failure, latency, cost
  - [ ] Alerts on error spikes, throttling, cost anomalies
  - [ ] Human-in-the-loop approval for destructive steps
  - [ ] Kill switch documented and tested (non-destructive)
- **Reliability**
  - [ ] Retries are bounded and idempotent
  - [ ] Dead-letter queue or quarantine for repeated failures
  - [ ] Timeouts set; no infinite waits

---

## After: Verify and Close Out
- **Validation**
  - [ ] Post-run checks meet success criteria
  - [ ] Data integrity verified (counts, checksums, invariants)
  - [ ] Diff/snapshot compares expected vs actual
- **Cleanup**
  - [ ] Temporary credentials revoked; flags reset
  - [ ] Unused artifacts deleted (dumps, temp files)
  - [ ] Costs reviewed; anomalies investigated
- **Documentation & Learning**
  - [ ] Results recorded in ticket; links to logs/dashboards
  - [ ] Runbook updated with lessons learned
  - [ ] Postmortem created if issues occurred

---

## Run Command Template
Example pattern for safe execution. Replace placeholders explicitly.

```bash
# Always begin with a dry run
ENV=staging \
AUTOMATION_VERSION=1.2.3 \
TOKEN_FROM_VAULT=... \
automation run \
  --dry-run \
  --scope-file ./scope/canary.json \
  --rate-limit 10/s \
  --max-concurrency 4 \
  --retry 3 \
  --backoff exponential \
  --idempotency-key $(date +%Y%m%d%H%M%S) \
  --log-format json \
  --abort-on-error-rate 2% \
  --metrics-endpoint https://metrics.example

# Then progressively remove --dry-run and expand scope
```

---

## References
- NIST SP 800-53 (CM, CP, SI families)
- SRE best practices (progressive delivery, error budgets, runbooks)

