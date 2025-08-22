#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const reportsDir = path.join(__dirname, '..', 'reports');
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

// Deterministic mock numbers; replace with real model when env/secrets available
const baselineRevenueUsd = 1250000; // last 30d
const growthRatePct = 8.5; // MoM
const runwayMonths = 18; // at current burn
const burnUsd = 68000; // monthly
const stressDownsidePct = -30; // traffic shock

const stressedRevenueUsd = Math.round(baselineRevenueUsd * (1 + stressDownsidePct / 100));
const stressedRunwayMonths = Math.max(6, Math.floor(runwayMonths - 4));

const data = {
	as_of: new Date().toISOString(),
	currency: 'USD',
	baseline: {
		revenue_usd_30d: baselineRevenueUsd,
		growth_rate_pct_mom: growthRatePct,
		runway_months: runwayMonths,
		burn_usd_monthly: burnUsd
	},
	stress_test: {
		downside_pct: stressDownsidePct,
		revenue_usd_30d: stressedRevenueUsd,
		runway_months: stressedRunwayMonths
	}
};

fs.writeFileSync(path.join(reportsDir, 'noid_financial.json'), JSON.stringify(data, null, 2));
console.log('Wrote reports/noid_financial.json');