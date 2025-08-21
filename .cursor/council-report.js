#!/usr/bin/env node
const fs = require('fs');
const summary = {
  scores: { market: null, architecture: null, execution: null, brand: null, performance: null },
  links: { preview: process.env.VERCEL_URL || null, health: '/api/health' }
};
fs.mkdirSync('reports', { recursive: true });
fs.writeFileSync('reports/council-summary.json', JSON.stringify(summary, null, 2));
console.log('Council summary → reports/council-summary.json');
