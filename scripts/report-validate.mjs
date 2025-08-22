#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const reportsDir = path.join(process.cwd(), 'reports');
const jsonPath = path.join(reportsDir, 'noid_financial.json');
const mdPath = path.join(reportsDir, 'noid_board_review.md');

const fail = (msg) => { console.error(msg); process.exit(1); };

if (!fs.existsSync(jsonPath)) fail('Missing reports/noid_financial.json');
if (!fs.existsSync(mdPath)) fail('Missing reports/noid_board_review.md');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const md = fs.readFileSync(mdPath, 'utf8');

// Check for literal \n artifacts
if (/\\n/.test(md)) fail('Markdown contains literal \\n sequences');

// Verify numbers are present
const mustInclude = [
	String(data.baseline.revenue_usd_30d.toLocaleString('en-US')),
	String(data.baseline.growth_rate_pct_mom),
	String(data.baseline.burn_usd_monthly.toLocaleString('en-US')),
	String(data.baseline.runway_months),
	String(data.stress_test.revenue_usd_30d.toLocaleString('en-US')),
	String(data.stress_test.runway_months)
];

for (const token of mustInclude) {
	if (!md.includes(token)) fail(`Markdown missing value: ${token}`);
}

console.log('Report validation passed ✅');