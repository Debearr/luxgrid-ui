## Overview
Enterprise-grade AI Council market intelligence system with automated weekly reports, validation, and dashboard integration.

## Architecture

```
GitHub Action (Weekly) → Multi-Pass AI Pipeline → Validated JSON → Dashboard + Notifications
                                                                 ↓
                                               Historical Archive + Delta Analysis
```

## Quick Start

### 1. Environment Setup
```bash
# Required
ANTHROPIC_API_KEY=your_claude_key

# Optional
GEMINI_API_KEY=your_gemini_key
SLACK_WEBHOOK_URL=your_slack_webhook
REPORTS_DIR=reports  # default

# Models (optional overrides)
CLAUDE_MODEL=claude-3-5-sonnet-20240620
GEMINI_MODEL=gemini-1.5-pro
```

### 2. Install Dependencies
```bash
npm install @anthropic-ai/sdk @google/generative-ai pino zod yargs
```

### 3. File Structure
```
├── .github/workflows/enhanced-market-scout.yml
├── app/api/market/route.ts
├── app/dashboard/market/page.tsx
├── lib/logger.ts
├── schemas/market.zod.ts
├── scripts/
│   ├── market-scout.js
│   └── compute-delta.js
├── prompts/
│   ├── system.txt
│   ├── user.txt
│   ├── schema-validator.txt
│   └── integrity-checker.txt
├── reports/
│   ├── latest.json -> YYYY-MM-DDTHH-MM-SSZ/market.json
│   └── YYYY-MM-DDTHH-MM-SSZ/
│       ├── market.json
│       ├── validation.md
│       └── delta.json
└── docs/market-intel.md
```

## System Flow

### Automated Weekly Process (Mondays 13:00 UTC)

1. Generate Draft (Claude + optional Gemini ensemble)
2. Schema Validation (Structure compliance)
3. Integrity Pass (Content quality, brevity, actionability)
4. Delta Analysis (Week-over-week changes)
5. Validation Report (Quality assurance)
6. Update Dashboard (Symlink latest.json)
7. Notify Stakeholders (GitHub Issue + Slack)

### Manual Triggers

```bash
# GitHub Actions UI
Actions → Enhanced Market Scout → Run workflow

# Local development
npm run scout:local

# CLI direct
node scripts/market-scout.js --mode generate --system prompts/system.txt --user prompts/user.txt --output test.json
```

## API Endpoints

### `/api/market`
Returns latest market intelligence with status flag:
- latest - Fresh from current week
- fallback - Previous week's data
- error - No data available (returns scaffold)

Response Schema:
```typescript
{
  timestamp: string
  status?: 'latest' | 'fallback' | 'error'
  executive_brief: string
  scorecard: {
    market_fit: number (0-10)
    product_readiness: number (0-10)
    brand_alignment: number (0-10)
    growth_engine: number (0-10)
    seo_position: number (0-10)
    risk: number (0-10)
  }
  opportunities: Array<{
    title: string
    why_now: string
    segment: string
    expected_impact: string
    confidence: number (0-1)
    effort_days: number
  }>
  top_5_actions: Array<{
    name: string
    why: string
    roi: 'high' | 'med' | 'low'
    difficulty: 'easy' | 'med' | 'hard'
    deadline_days: number
  }>
  seo: {
    priority_keywords: Array<{
      keyword: string
      intent: string
      difficulty: number (0-100)
      opportunity: 'high' | 'med' | 'low'
    }>
  }
  social_drip?: {
    twitter_threads: Array<{
      hook: string
      beats: string[]
      cta: string
    }>
  }
  deltas?: {
    changed_metrics: Array<{
      key: string
      from: number
      to: number
    }>
  }
}
```

## Dashboard Features

### `/dashboard/market`
- Executive Brief - Weekly summary
- Performance Scorecard - 6 key metrics with visual bars
- Priority Actions - Top 5 with ROI/difficulty badges
- Market Opportunities - Scored and segmented
- SEO Keywords - Prioritized with difficulty ratings
- Twitter Content - Ready-to-post thread ideas
- What's New - Week-over-week changes (if deltas available)
- System Status - AI Council health indicators

## Validation & Quality Assurance

### Automated Validation Report
Each run generates `/reports/TIMESTAMP/validation.md`:

```markdown
# Validation Report - YYYY-MM-DD

## Schema Compliance ✅
- All required fields present
- Data types correct
- Enum values valid

## Content Quality ✅
- Executive brief: 87 words (target: <100)
- Actions: 5 unique, specific, actionable
- Opportunities: mapped to scorecard gaps
- No generic/filler content detected

## System Health ✅
- Generation latency: 3.2s
- Retries triggered: 0
- Fallback used: No
- Confidence score: 0.92

## Flags
- None
```

### Quality Gates
- Schema validation with Zod runtime checks
- Content integrity ensures actionable, specific recommendations
- Semantic mapping validates actions align with opportunities
- Historical consistency checks for major unexplained changes

## Troubleshooting

### Common Issues

No data in dashboard
```bash
# Check latest.json exists
ls -la reports/latest.json

# Validate JSON structure
node -e "console.log(JSON.parse(require('fs').readFileSync('reports/latest.json','utf8')))"

# Check API endpoint
curl http://localhost:3000/api/market
```

GitHub Action failing
```bash
# Check secrets are set
echo $ANTHROPIC_API_KEY | cut -c1-10

# Review logs in Actions tab
# Look for: generation, validation, integrity pass failures
```

Schema validation errors
```bash
# Run validation manually
node scripts/market-scout.js --mode validate --system prompts/schema-validator.txt --input reports/TIMESTAMP/draft.json --output test.json
```

## Development

### Local Testing

```bash
# Mock development mode
echo '{"timestamp":"2024-01-01T00:00:00Z","status":"error",...}' > reports/mock.json
ln -sf mock.json reports/latest.json

# Hot reload dashboard
npm run dev
# Visit http://localhost:3000/dashboard/market
```

### Adding New Metrics

1. Update `schemas/market.zod.ts`
2. Modify prompts to include new fields
3. Update dashboard component to render new data
4. Test with validation pipeline

### Multi-Brand Support

The system supports brand-specific analysis:
```bash
# Set brand context in workflow
env:
  BRAND: "AuraFX"  # or "NØID", "LuxGrid"
```

## Security & Compliance

### Data Protection
- API keys redacted in logs via pino configuration
- PII detection patterns in logger.ts
- Output sanitization in validation passes

### Rate Limiting
- Exponential backoff on API failures
- Request deduplication via caching
- Circuit breaker pattern for resilience

## Scaling & Performance

### Current Capacity
- Generation: ~30s per report
- Validation: ~10s additional
- Storage: ~50KB per report
- API response: <100ms (cached)

### Optimization Options
- Caching layer (Redis) for repeated analyses
- Parallel processing for multi-brand reports
- Semantic search over historical reports
- Vector embeddings for trend detection

## Monitoring & Alerts

### GitHub Integration
- Issues created for each report with executive summary
- Actions summary shows generation status
- PR comments on schema/prompt changes

### Slack Integration (Optional)
```json
{
  "text": "🤖 **Weekly Market Intel**\n\nExecutive Brief\n\n🎯 **Top Priority:** Action Name\n\n📊 Full report in GitHub Issues"
}
```

### Custom Webhooks
Add webhook URLs to environment:
```bash
WEBHOOK_URLS=https://hooks.slack.com/...,https://discord.com/api/webhooks/...
```

## Future Enhancements

### Planned Features
- Historical trends visualization
- Competitive benchmarking with public data
- Sentiment analysis of market signals
- A/B testing of different prompt strategies

### Integration Opportunities
- Notion database sync for project management
- Email digests for executive teams
- Mobile app push notifications
- CRM integration for opportunity tracking

## Support & Maintenance

### Regular Maintenance
- Weekly: Review validation reports for quality
- Monthly: Archive old reports, update prompts based on market changes
- Quarterly: Evaluate AI model performance, consider upgrades

### Getting Help
- GitHub Issues: Bug reports and feature requests
- Validation Reports: Quality indicators and flags
- Logs: Structured logging with request tracing
- Documentation: This file + inline code comments

---

## Quick Reference Commands

```bash
# Manual run
gh workflow run "Enhanced Market Scout"

# Check latest status
jq '.status' reports/latest.json

# View validation report
cat reports/$(ls reports | grep -E '^202' | sort | tail -1)/validation.md

# Dashboard URL
http://localhost:3000/dashboard/market

# API health check
curl -s http://localhost:3000/api/market | jq '.status'
```

---

Last updated: 2024-01-01 | Version: 2.1 | AI Council Amalgamated Edition

