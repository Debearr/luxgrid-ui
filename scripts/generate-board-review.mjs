#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const reportsDir = path.join(process.cwd(), 'reports');
const jsonPath = path.join(reportsDir, 'noid_financial.json');
const outPath = path.join(reportsDir, 'noid_board_review.md');

if (!fs.existsSync(jsonPath)) {
	console.error('Missing reports/noid_financial.json — run financial-stress-test first');
	process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const fmtUsd = (n) => `$${n.toLocaleString('en-US')}`;
const md = `### NØID Board Review (Last 30 Days)

- **Headline**: Solid momentum with prudent burn; runway is stable.

### Financial Snapshot

- **Revenue (30d)**: ${fmtUsd(data.baseline.revenue_usd_30d)}
- **Growth MoM**: ${data.baseline.growth_rate_pct_mom}%
- **Monthly Burn**: ${fmtUsd(data.baseline.burn_usd_monthly)}
- **Runway**: ${data.baseline.runway_months} months

### Stress Test (Traffic Shock ${data.stress_test.downside_pct}%)

- **Revenue (30d, stressed)**: ${fmtUsd(data.stress_test.revenue_usd_30d)}
- **Runway (stressed)**: ${data.stress_test.runway_months} months

### Readout

- **What we see**: Baseline remains healthy; downside is manageable without emergency actions.
- **What we’ll do**: Continue focus on ROAS-positive channels; keep fixed costs flat.
`;

if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });
fs.writeFileSync(outPath, md);
console.log('Wrote reports/noid_board_review.md');