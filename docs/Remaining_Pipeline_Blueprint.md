## Remaining Pipeline Blueprint

This blueprint lists missing modules, scripts, and docs for NØID, AuraFX, and the App Factory template. It is paired with `pipeline.manifest.yaml` for automated generation.

### NØID – Smart Driver Assistant

```
apps/noid/
  ocr/
    firebase_ml_client.ts           # Firebase ML wrapper with retry and confidence scoring
    paddle_ocr_service.py           # PaddleOCR microservice (FastAPI) + Dockerfile
    tesseract_fallback.py           # Optional local OCR fallback
    router.ts                       # API routes: /ocr/extract, /ocr/health
    fixtures/                       # Test images and expected JSON
  dashboard/
    pages/
      index.tsx                     # Driver dashboard home (trips, earnings)
      logs.tsx                      # Tasker log viewer + filters
    components/
      MetricsCards.tsx
      TripTable.tsx
      AcceptanceChart.tsx
    lib/
      tasker_log_parser.ts          # Parse Tasker TSV/CSV exports
      metrics.ts                    # Earnings, acceptance, filter efficacy
  beta/
    intake_form.md                  # Driver signup questions
    feedback_template.md            # Issue template for beta feedback
    privacy_brief.md                # Data handling and anonymization
  kickstarter/
    storyboard.md                   # Video storyboard + shot list
    rewards.md                      # Reward tiers + costs
    press_kit/
      readme.md
      logos/
      banners/
```

### AuraFX – Trading SaaS

```
apps/aurafx/
  dashboard/
    app/
      layout.tsx
      page.tsx
      signals/page.tsx              # Signals view with health + latency
    components/
      Chart.tsx
      HealthBadge.tsx
      SubscriptionStatus.tsx
    lib/
      feeds/
        crypto_ws.ts                # Crypto feed client with backoff
        forex_rest.ts               # Forex REST polling with jitter
      signals/
        rules.ts                    # SMA/EMA/RSI rules
        engine.ts                   # Baseline signal engine
        backtest.ts                 # Backtesting utilities
      billing/
        stripe.ts                   # Stripe SDK + webhooks
        crypto.ts                   # Coinbase Commerce/BTCPay wrapper
    pages/api/
      health.ts
      signals.ts
      webhooks/stripe.ts
      webhooks/crypto.ts
  docs/
    alpha_invite.md
    data_dictionary.md
```

### App Factory – Template & CI/CD

```
templates/saas-studio/
  brand/
    brand.yml                       # Colors, typography, headers, taglines
    lock.json                       # Brand lock hash + approved zones
  scripts/
    create-app.ts                   # CLI to generate new app from template
    generate-docs.ts                # Auto README + handoff guide
    brand-validate.ts               # CI brand guardrail checks
  .github/workflows/
    ci.yml                          # Lint, typecheck, test, brand, build
    smoke.yml                       # Parallel smoke matrix across stacks
    pr-metrics.yml                  # Bundle, Lighthouse, CWV, TTI comments
  apps/
    landing/
      pages/index.tsx               # Brand-safe landing page
      public/
        logos/
    dashboard/
      app/layout.tsx
      app/page.tsx
      components/
      lib/
  docs/
    handoff_guide.md
    README.template.md
```

### Shared Tooling

```
packages/
  eslint-config/
  tsconfig/
  ui/
  brand-lint/
  metrics-bot/
```

### Environment & Secrets
- Use `.env.example` for each app with minimal variables.
- Use `doppler`/`1Password`/`Vault` for secret management; never commit secrets.

### Notes
- All additions must be additive; landing pages are protected by brand checks.
- Prefer feature flags and preview deployments.