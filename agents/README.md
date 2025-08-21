Ecosystem Zero-Touch Creator
============================

What this is
------------
An agent chain you can run in Cursor to convert an idea into a branded, scaffolded, and deployable project with self-healing validation.

Files
-----
- `agents/zero_touch_creator.chain.yaml`: The agent chain definition.

Prerequisites
-------------
- Node.js 20+, corepack enabled
- pnpm (or let the chain install it)
- Python 3.10+
- Docker (optional, for local deploy)
- Environment: `OPENAI_API_KEY` required. Optional: `VERCEL_TOKEN`, `RAILWAY_TOKEN`, `GITHUB_TOKEN`.

How to run in Cursor
--------------------
1. Open `agents/zero_touch_creator.chain.yaml` in Cursor.
2. Use Cursor Agents to run the chain with inputs, for example:
   - `idea`: "Lightweight personal finance insights assistant"
   - `target_users`: "Retail investors and budgeters"
   - `success_criteria`: "MVP deployed; 3 core insights; p95 < 200ms API"
   - `deployment_targets`: `["vercel", "railway"]`
3. The chain will generate a brand kit, scaffold a monorepo (web, api, mobile), wire theming, add CI, run smoke checks, produce a deploy plan, and output a delivery bundle under `<repo>/.delivery`.

Outputs
-------
- Brand kit under `brand_kit/` and copied to `<repo>/.delivery/brand_kit`
- Monorepo at `projects/<brand>/`
- Council review JSON under `reports/`
- Deployment plan under `deploy/`

Notes
-----
- Cloud deployment steps are planned and templated; actual deployment requires tokens configured as repository or workspace secrets.
- The chain is self-healing up to a small number of iterations; increase in the YAML if desired.

