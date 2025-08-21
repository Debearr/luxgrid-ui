# AuraFX × NØID — Zero-Touch Deployment PRD (v2.1)
**Date:** 2025-08-21  
**Objective:** Fully automated Council→PR→Auto-Merge→Vercel deploy with post-deploy validation & automatic rollback. Brand rules enforced. One-click copy/paste outputs.

## Requirements
- Triggers: schedule q6h, push on develop, repository_dispatch:council-run-requested, manual.
- Council = 5 seats → JSON reports + consolidated MD artifact.
- Quality Gates (must PASS): tests, security (npm audit high), perf budgets (CWV/Lighthouse), brand-validator.
- PASS → create PR → auto-approve (CODEOWNERS) → auto-merge → deploy.
- FAIL at any stage → open GitHub Issue w/ artifacts, label `council-fail`, no deploy.
- Post-deploy: /health (200), Lighthouse ≥ 90, LCP ≤ 2.0s, CLS ≤ 0.1. Fail → rollback to last green Vercel deployment.
- Concurrency: cancel in-progress runs (single lane).
- Permissions: workflows can create PRs, write contents, set auto-merge.
- Observability: artifact upload, console outputs. Slack optional.

## KPIs
- Council→Live ≤ 5 min
- Fail-to-rollback ≤ 2 min
- Manual interventions: 0/week
- Errors auto-resolved < 5 min

## Feature Flags (.council/manifest.json)
- BRAND_VALIDATION=true
- ZERO_TOUCH_DEPLOY=true
- ROLLBACK_ON_FAIL=true
- PERF_BUDGETS_ENFORCED=true

