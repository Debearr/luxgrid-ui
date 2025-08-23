## Unified Execution & Sprint Plan – NØID + AuraFX + App Factory

### Mission
Execute the final 90-day dual-track rollout plan for:
- **NØID Smart Driver Assistant**: Kickstarter launch + driver beta
- **AuraFX Trading SaaS**: MVP dashboard & live signals
- **App Factory Ecosystem**: Repeatable brand + SaaS factory

### Strict Rules
- Keep landing pages pristine (NØID + AuraFX visuals). Do not modify existing landing page assets or styles except in the designated brand-safe sections.
- Do not break existing CI/CD. Only add optimizations and additive workflows.
- All changes must be additive, validated, and brand-safe.
- Use AI Council orchestration for strategy, fact-checking, coding, and creative.

### Phases

#### Phase 1: NØID Smart Driver Assistant
- Finish OCR Rescue Path (Firebase ML + PaddleOCR fallback; local Tesseract optional) with confidence scoring and safe fallbacks.
- Add driver dashboard (React/Next.js or React Native Web) reading Tasker logs; provide metrics: trips, earnings, acceptance, filter efficacy.
- Kickstarter assets: video storyboard, landing visuals, reward tiers, press kit.
- Beta test with 10–20 Spark drivers; log anonymized metrics and feedback.

#### Phase 2: AuraFX Trading SaaS
- Build MVP dashboard (Next.js, Tailwind, Recharts) with auth, layout, charts.
- Live health endpoint and baseline signals (SMA/EMA crossover, RSI); LSTM later.
- Subscription billing (Stripe + crypto via Coinbase Commerce or BTCPay).
- Onboard 5–10 alpha traders; collect feedback and iterate weekly.

#### Phase 3: App Factory
- Codify pipeline template (Next.js + Cursor + CI/CD).
- Brand guardrails (headers, colors, taglines) with automated checks.
- Auto-generate README/docs for each new project.
- Modularize landing → dashboard → SaaS repeat cycle.

### AI Council – Roles
- **Claude**: Strategic clarity, moat, investor pitch decks, Kickstarter copy.
- **DeepSeek**: Architecture validation, scalability, performance optimizations.
- **Gemini**: Market analysis, UX differentiation, moat opportunities.
- **Copilot**: Generate connectors, stubs, interface scaffolding.
- **Perplexity**: Fact-check competitors, regulations, and trends.
- **Cursor**: Orchestrator; enforce CI/CD, brand safety, automated deployment.

### 90-Day Sprint Calendar (Weeks 1–12)

#### Weeks 1–2 (Setup & Guardrails)
- NØID: Finalize OCR Rescue Path + integrate mock location toggle.
- AuraFX: Create MVP dashboard skeleton (auth, layout, charts).
- App Factory: Clean pipeline and enforce brand guardrails.
- Optional: Pre-commit hooks + local dev helpers.
- AI Council: DeepSeek validates pipeline, Claude polishes Kickstarter copy.
- Done means:
  - OCR path runs with test images and returns structured JSON + confidence.
  - AuraFX dashboard renders demo data and protected routes.
  - Brand checks fail CI on header/tagline deviations.

#### Weeks 3–4 (Core MVP Build)
- NØID: Driver dashboard → trip logs, earnings tracker, acceptance rate.
- AuraFX: Hook live market feeds (crypto + forex baseline).
- App Factory: Automate landing page + dashboard replication (template CLI).
- Optional: Add parallel smoke tests + PR metrics to CI/CD.
- AI Council: Gemini benchmarks UX, Copilot generates connectors.
- Done means:
  - NØID dashboard ingesting sample Tasker logs or synthetic fixtures.
  - AuraFX charts wired to live feed with circuit breakers and retries.
  - CLI creates new SaaS skeleton with brand-safe defaults in <5 minutes.

#### Weeks 5–6 (Integration & Branding)
- NØID: Kickstarter landing page live (preview env only).
- AuraFX: Build first signal engine (baseline ML, non-discretionary rules).
- App Factory: Add auto-generated README/docs (usage, deploy, env vars).
- Optional: Add brand validation checks in CI (headers + taglines).
- AI Council: Perplexity validates competitors + compliance gaps.
- Done means:
  - Preview URL passes Lighthouse and brand compliance checks.
  - Signal engine emits backtest metrics on seed dataset.
  - Docs generated on repo creation with up-to-date commands.

#### Weeks 7–8 (Beta Testing & Feedback)
- NØID: Beta with 10–20 Spark drivers (earnings + order acceptance logs).
- AuraFX: Invite 5–10 alpha traders to dashboard.
- App Factory: Document developer handoff guide.
- Optional: PR comments enhanced with performance metrics.
- AI Council: Claude drafts investor deck.
- Done means:
  - Beta feedback captured in issues with prioritization labels.
  - Alpha traders have accounts; activity logged; churn monitored.
  - Handoff guide enables a new dev to ship a feature day 1.

#### Weeks 9–10 (Kickstarter + MVP Lockdown)
- NØID: Kickstarter campaign launch + FOMO video.
- AuraFX: Add Stripe/crypto billing integration.
- App Factory: Harden deployment with parallel smoke tests.
- Optional: Add smart caching to CI builds.
- AI Council: Gemini crafts Kickstarter UX flow.
- Done means:
  - Kickstarter page approved, previewed by advisors, tracking pixels live.
  - Billing creates customer, trial, and webhooks verified in test mode.
  - Smoke tests run on each PR across matrix of templates.

#### Weeks 11–12 (Public Launch + Investor Readiness)
- NØID: Public Kickstarter push + press kit distribution.
- AuraFX: MVP signals live + subscription billing active.
- App Factory: Finalize as "SaaS Studio Template" for De Bear Labs.
- Optional: Brand compliance automation across repos.
- AI Council: Claude + DeepSeek finalize scaling roadmap.
- Done means:
  - Press kit delivered; coverage tracked; UTM links monitored.
  - Signals page shows live status, latency, and incidents feed.
  - Template cloned into a greenfield repo deploys to prod on first push.

### Deliverables
- Code: OCR Rescue (NØID), Signal Engine (AuraFX), CI/CD templates (App Factory).
- Docs: README auto-gen, developer handoff guide, investor deck.
- Assets: Kickstarter visuals, dashboards, branding lock.
- Validation: Brand headers, tagline integrity, landing visuals intact.

### CI/CD Enhancements (Additive Only)
- Parallel smoke tests for templates (matrix by stack + route set).
- PR metrics bot: bundle size, Lighthouse, Core Web Vitals, TTI.
- Build caching: node_modules/pnpm-cache + Next.js .next cache.
- Brand validation: check headers, logos, taglines vs brand.yml.
- Pre-commit: lint, typecheck, test, brand-lint, secret scan.

### Brand Guardrails
- Central `brand.yml` defines logos, colors, typography, taglines.
- CI validates critical landing page elements remain unchanged.
- Approved modification zones: modular content sections only.

### Differentiation & Moat
- NØID: Driver tool with undetectable automation + filters.
- AuraFX: Trading SaaS with white-label signal syndication.
- App Factory: Dev factory with brand + CI/CD integration baked in.

### Commit Message
```bash
feat(plan): 90-day rollout – NØID launch + AuraFX MVP + App Factory factory
```

### Notes for Orchestrator (Cursor)
- Enforce additive edits only; fail on destructive diffs in protected paths.
- Prefer feature flags and preview environments before prod cutovers.
- Record artifact links (previews, dashboards, decks) in the handoff guide.