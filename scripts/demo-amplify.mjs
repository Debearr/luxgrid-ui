#!/usr/bin/env node

import { amplifyIntelligence } from './intelligence-amplifier.mjs';

async function main() {
  const sample = {
    domain: 'example.com',
    tech_stack: ['React', 'Node', 'Postgres', 'Kubernetes'],
    scorecard: [
      { category: 'performance', target: 8 },
      { category: 'security', target: 7 },
      { category: 'product', target: 9 }
    ],
    tasks: [
      { id: 'T1', title: 'Build UI shell', component: 'UI' },
      { id: 'T2', title: 'Design API v1', component: 'API', dependsOn: ['T1'] },
      { id: 'T3', title: 'DB schema v1', component: 'DB' }
    ],
    metrics: ['p95 latency under 250ms', 'error rate < 0.1%'],
    weeklyPlan: [
      { week: 1, tasks: [{ title: 'Scale read replicas' }, { title: 'UI polish' }] },
      { week: 2, tasks: [{ title: 'Security review' }, { title: 'API rate limits' }] }
    ],
    quickWins: [
      { title: 'Cache layer', roi: 'High' },
      { title: 'Optimize bundle', roi: 'Medium' }
    ],
    demoFeatures: ['Dashboard', 'Auth', 'Reports'],
    actions: [
      { title: 'Implement CDN', roi: 'High' },
      { title: 'Refactor legacy module', roi: 'Low' }
    ],
    businessModel: 'SaaS'
  };

  const amplified = await amplifyIntelligence(sample);
  // Pretty-print as JSON for quick inspection
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(amplified, null, 2));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

