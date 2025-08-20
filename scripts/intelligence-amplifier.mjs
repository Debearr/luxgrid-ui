/**
 * Intelligence Amplification Layer
 *
 * This module augments a base analysis object with higher-order signals:
 * - Market/benchmark enrichment
 * - Predictive modeling
 * - Visual insight generation (spec stubs)
 * - Resource optimization
 * - Competitive positioning
 *
 * The implementation is offline-friendly: it does not require external API
 * access and will derive reasonable heuristics from the provided baseAnalysis.
 * If you later wire real providers, replace the internal helpers with
 * network-backed implementations that respect timeouts and credentials.
 */

/**
 * Public API
 * @param {object} baseAnalysis - Input object containing raw analysis, e.g.:
 *   {
 *     domain, tech_stack, technologies, scorecard, tasks, metrics,
 *     weeklyPlan, quickWins, demoFeatures, actions
 *   }
 * @returns {Promise<object>} amplified analysis
 */
export async function amplifyIntelligence(baseAnalysis) {
  validateBaseAnalysis(baseAnalysis);

  const [marketData, predictive, visual, resource, competitive] = await Promise.all([
    enrichWithMarketData(baseAnalysis),
    addPredictiveModeling(baseAnalysis),
    generateVisualInsights(baseAnalysis),
    calculateResourceOptimization(baseAnalysis),
    assessCompetitivePosition(baseAnalysis)
  ]);

  const enhancedAggregate = {
    marketData,
    predictive,
    visual,
    resource,
    competitive
  };

  const intelligenceScore = calculateIntelligenceScore(enhancedAggregate);
  const confidenceIntervals = calculateConfidenceIntervals(enhancedAggregate);
  const scenarioModels = generateScenarioModels(enhancedAggregate);
  const prioritizedActions = optimizeActionPriority(enhancedAggregate, baseAnalysis.actions);

  return {
    ...baseAnalysis,
    market_data: marketData,
    predictive_metrics: predictive.predictiveMetrics,
    visual_insights: visual,
    resource_optimization: resource,
    competitive_intelligence: competitive,
    intelligence_score: intelligenceScore,
    confidence_intervals: confidenceIntervals,
    scenario_modeling: scenarioModels,
    action_prioritization: prioritizedActions
  };
}

// ---------------------------- Validation ----------------------------

function validateBaseAnalysis(baseAnalysis) {
  if (baseAnalysis == null || typeof baseAnalysis !== 'object') {
    throw new Error('amplifyIntelligence: baseAnalysis must be a non-null object');
  }
}

// ------------------------ Market Enrichment -------------------------

async function enrichWithMarketData(baseAnalysis) {
  const technologyList = normalizeTechnologies(baseAnalysis);
  const domain = typeof baseAnalysis.domain === 'string' ? baseAnalysis.domain : null;
  const scorecard = Array.isArray(baseAnalysis.scorecard) ? baseAnalysis.scorecard : [];

  const performancePercentile = estimatePerformancePercentile(scorecard);
  const securityRelativeScore = estimateSecurityRelativeScore(domain, scorecard);
  const techAdoptionCurve = estimateTechAdoptionCurve(technologyList);

  return {
    industry_percentile: performancePercentile, // 0..100
    security_vs_peers: securityRelativeScore,  // 0..100
    tech_adoption_curve: techAdoptionCurve     // {stage, rationale}
  };
}

function normalizeTechnologies(baseAnalysis) {
  if (Array.isArray(baseAnalysis.technologies)) return baseAnalysis.technologies.map(String);
  if (Array.isArray(baseAnalysis.tech_stack)) return baseAnalysis.tech_stack.map(String);
  if (typeof baseAnalysis.tech_stack === 'string') return baseAnalysis.tech_stack.split(/[ ,]/g).filter(Boolean);
  return [];
}

function estimatePerformancePercentile(scorecard) {
  if (!Array.isArray(scorecard) || scorecard.length === 0) return 50;
  const performanceTargets = scorecard
    .filter((item) => typeof item.target === 'number')
    .map((item) => clamp(item.target, 0, 10));
  if (performanceTargets.length === 0) return 55;
  const averageTarget = performanceTargets.reduce((sum, n) => sum + n, 0) / performanceTargets.length;
  return Math.round(40 + averageTarget * 6); // maps 0..10 to ~40..100
}

function estimateSecurityRelativeScore(domain, scorecard) {
  const hasSecurityTasks = Array.isArray(scorecard) && scorecard.some((s) => String(s.category || '').toLowerCase().includes('security'));
  const base = domain ? 60 : 50;
  return clamp(base + (hasSecurityTasks ? 15 : -5), 0, 100);
}

function estimateTechAdoptionCurve(technologies) {
  const lower = new Set(technologies.map((t) => String(t).toLowerCase()));
  const isCuttingEdge = ['bun', 'deno', 'qwik', 'svelte', 'rust', 'wasm'].some((k) => lower.has(k));
  const isMainstream = ['react', 'node', 'express', 'postgres', 'next.js', 'typescript', 'kubernetes'].some((k) => lower.has(k));
  if (isCuttingEdge) {
    return { stage: 'early_adopter', rationale: 'Uses emerging technologies with strong momentum' };
  }
  if (isMainstream) {
    return { stage: 'early_majority', rationale: 'Relies on proven, widely adopted technologies' };
  }
  return { stage: 'late_majority', rationale: 'Technology mix appears stable and conservative' };
}

// ----------------------- Predictive Modeling ------------------------

async function addPredictiveModeling(baseAnalysis) {
  const signals = extractSignals(baseAnalysis);
  const probabilityOfSuccess = estimateSuccessProbability(signals);
  const riskFactors = deriveRiskFactors(signals);
  const accelerators = deriveAccelerators(signals);

  return {
    predictiveMetrics: {
      probability_of_success: roundTo(probabilityOfSuccess, 0.01),
      risk_factors: riskFactors,
      success_accelerators: accelerators
    }
  };
}

function extractSignals(baseAnalysis) {
  const weeklyPlan = Array.isArray(baseAnalysis.weeklyPlan) ? baseAnalysis.weeklyPlan : [];
  const tasks = Array.isArray(baseAnalysis.tasks) ? baseAnalysis.tasks : [];
  const metrics = Array.isArray(baseAnalysis.metrics) ? baseAnalysis.metrics : [];
  const teamVelocity = weeklyPlan.reduce((sum, w) => sum + (Array.isArray(w.tasks) ? w.tasks.length : 0), 0);
  const hasScalingTasks = weeklyPlan.some((w) => Array.isArray(w.tasks) && w.tasks.some((t) => containsWord(String(t.title || ''), 'scale')));
  const hasSecurityTasks = tasks.some((t) => String(t.category || '').toLowerCase() === 'security');
  const p95MetricPresent = metrics.some((m) => /p95|p90|latency/i.test(String(m)));
  const quickWins = Array.isArray(baseAnalysis.quickWins) ? baseAnalysis.quickWins : [];
  const hasHighROIQuickWin = quickWins.some((w) => String(w.roi || '').toLowerCase() === 'high');

  return {
    teamVelocity,
    hasScalingTasks,
    hasSecurityTasks,
    p95MetricPresent,
    hasHighROIQuickWin
  };
}

function estimateSuccessProbability(signals) {
  let probability = 0.5;
  if (signals.teamVelocity > 15) probability += 0.15;
  if (signals.hasScalingTasks) probability += 0.07;
  if (signals.hasSecurityTasks) probability += 0.05;
  if (signals.p95MetricPresent) probability += 0.05;
  if (signals.hasHighROIQuickWin) probability += 0.08;
  return clamp(probability, 0.05, 0.98);
}

function deriveRiskFactors(signals) {
  const riskFactors = [];
  if (!signals.hasSecurityTasks) {
    riskFactors.push({ factor: 'security_gap', impact_score: 7, mitigation_eta: '2 weeks' });
  }
  if (!signals.p95MetricPresent) {
    riskFactors.push({ factor: 'observability_insufficiency', impact_score: 5, confidence: 0.8 });
  }
  if (signals.teamVelocity < 8) {
    riskFactors.push({ factor: 'team_velocity', impact_score: 6, confidence: 0.75 });
  }
  return riskFactors;
}

function deriveAccelerators(signals) {
  const accelerators = [];
  if (signals.hasHighROIQuickWin) {
    accelerators.push({ factor: 'quick_wins', multiplier: 1.25, confidence: 0.85 });
  }
  if (signals.hasScalingTasks) {
    accelerators.push({ factor: 'scalability_foundation', multiplier: 1.15, confidence: 0.8 });
  }
  return accelerators;
}

// --------------------- Visual Insights (Specs) ----------------------

async function generateVisualInsights(baseAnalysis) {
  const scorecard = Array.isArray(baseAnalysis.scorecard) ? baseAnalysis.scorecard : [];
  const riskFactors = Array.isArray(baseAnalysis.risk_factors) ? baseAnalysis.risk_factors : [];
  const weeklyPlan = Array.isArray(baseAnalysis.weeklyPlan) ? baseAnalysis.weeklyPlan : [];
  const quickWins = Array.isArray(baseAnalysis.quickWins) ? baseAnalysis.quickWins : [];

  const charts = [
    generateChart('scorecard_radar', scorecard),
    generateChart('risk_heatmap', riskFactors),
    generateChart('timeline_gantt', weeklyPlan),
    generateChart('roi_matrix', quickWins)
  ];

  return {
    html: buildDashboardHTML(charts),
    pdf: generatePDF(charts),
    interactive: generateD3Visualization(charts)
  };
}

function generateChart(type, data) {
  return {
    type,
    spec_version: 'v0.1',
    data
  };
}

function buildDashboardHTML(charts) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>Executive Dashboard</title></head><body><pre>${escapeHtml(
    JSON.stringify(charts, null, 2)
  )}</pre></body></html>`;
}

function generatePDF(charts) {
  // In offline mode return a portable JSON string that a downstream PDF service can render.
  return { format: 'portable-spec', chartsCount: charts.length };
}

function generateD3Visualization(charts) {
  // Return a stub descriptor that a UI can pick up to render D3 visuals.
  return { library: 'd3', version: 'stub', charts };
}

// ---------------------- Resource Optimization ----------------------

async function calculateResourceOptimization(baseAnalysis) {
  const tasks = Array.isArray(baseAnalysis.tasks) ? baseAnalysis.tasks : [];
  const frontendTasks = tasks.filter((t) => String(t.component || '').toLowerCase().includes('ui'));
  const backendTasks = tasks.filter((t) => String(t.component || '').toLowerCase().includes('api') || String(t.component || '').toLowerCase().includes('db'));

  const frontendHours = Math.max(16, frontendTasks.length * 4);
  const backendHours = Math.max(16, backendTasks.length * 5);

  return {
    team_allocation: {
      frontend: { hours: frontendHours, priority_tasks: frontendTasks.map((t) => t.title || 'Task'), skill_gaps: [] },
      backend: { hours: backendHours, priority_tasks: backendTasks.map((t) => t.title || 'Task'), external_help_needed: backendHours > 40 }
    },
    budget_allocation: {
      immediate: { amount: 5000, roi_multiplier: 2.1 },
      month_2: { amount: 15000, roi_multiplier: 1.7 }
    },
    critical_path: deriveCriticalPath(tasks),
    parallel_workstreams: [
      { stream: 'performance', can_parallelize_with: ['security', 'ui'] },
      { stream: 'infrastructure', blocks: ['deployment', 'monitoring'] }
    ]
  };
}

function deriveCriticalPath(tasks) {
  const dependencies = tasks.filter((t) => Array.isArray(t.dependsOn) && t.dependsOn.length > 0);
  if (dependencies.length === 0) return tasks.slice(0, 3).map((t) => t.id || t.title || 'task');
  return dependencies.slice(0, 3).map((t) => t.id || t.title || 'task');
}

// ---------------------- Competitive Intelligence -------------------

async function assessCompetitivePosition(baseAnalysis) {
  const techStack = normalizeTechnologies(baseAnalysis);
  const businessModel = String(baseAnalysis.businessModel || 'saas').toLowerCase();
  const competitors = identifyCompetitors(techStack);
  const marketGaps = analyzeMarketGaps(businessModel);

  return {
    direct_competitors: competitors.direct,
    market_positioning: competitors.positioning,
    differentiation_opportunities: marketGaps.opportunities,
    threat_level: competitors.threat_assessment
  };
}

function identifyCompetitors(techStack) {
  const lower = new Set(techStack.map((t) => String(t).toLowerCase()));
  const direct = [];
  if (lower.has('react') && lower.has('node')) direct.push('Vercel-like startups');
  if (lower.has('kubernetes')) direct.push('Platform engineering tooling');
  const threatAssessment = direct.length >= 2 ? 'elevated' : direct.length === 1 ? 'moderate' : 'low';
  const positioning = direct.length ? 'crowded' : 'niche';
  return { direct, positioning, threat_assessment: threatAssessment };
}

function analyzeMarketGaps(businessModel) {
  const opportunities = businessModel.includes('saas')
    ? ['Usage-based pricing optimization', 'AI-assisted onboarding']
    : ['Partnership-led distribution', 'Enterprise contracts'];
  return { opportunities };
}

// ---------------------- Scoring + Scenarios ------------------------

function calculateIntelligenceScore(enhanced) {
  const weights = {
    marketData: 0.25,
    predictive: 0.25,
    resource: 0.2,
    competitive: 0.2,
    visual: 0.1
  };
  const marketScore = enhanced.marketData.industry_percentile / 100;
  const predictiveScore = enhanced.predictive.predictiveMetrics.probability_of_success;
  const resourceScore = 1 - (enhanced.resource.team_allocation.backend.external_help_needed ? 0.2 : 0);
  const competitiveScore = enhanced.competitive.threat_level === 'elevated' ? 0.6 : enhanced.competitive.threat_level === 'moderate' ? 0.75 : 0.9;
  const visualScore = 0.8; // visuals available

  const composite =
    marketScore * weights.marketData +
    predictiveScore * weights.predictive +
    resourceScore * weights.resource +
    competitiveScore * weights.competitive +
    visualScore * weights.visual;

  return roundTo(composite, 0.001);
}

function calculateConfidenceIntervals(enhanced) {
  const predictive = enhanced.predictive.predictiveMetrics.probability_of_success;
  const variability = enhanced.marketData.tech_adoption_curve.stage === 'early_adopter' ? 0.12 : 0.08;
  const halfWidth = Math.max(0.05, variability * (1 - predictive));
  return {
    probability_of_success: {
      lower: roundTo(Math.max(0, predictive - halfWidth), 0.001),
      upper: roundTo(Math.min(1, predictive + halfWidth), 0.001)
    }
  };
}

function generateScenarioModels(enhanced) {
  const baseProb = enhanced.predictive.predictiveMetrics.probability_of_success;
  return [
    { scenario: 'best_case', probability_of_success: roundTo(Math.min(1, baseProb + 0.15), 0.001) },
    { scenario: 'base_case', probability_of_success: roundTo(baseProb, 0.001) },
    { scenario: 'downside', probability_of_success: roundTo(Math.max(0, baseProb - 0.2), 0.001) }
  ];
}

function optimizeActionPriority(enhanced, actions) {
  const prioritized = Array.isArray(actions) ? [...actions] : [];
  prioritized.sort((a, b) => {
    const aROI = typeof a.roi === 'number' ? a.roi : a.roi === 'High' ? 3 : a.roi === 'Medium' ? 2 : 1;
    const bROI = typeof b.roi === 'number' ? b.roi : b.roi === 'High' ? 3 : b.roi === 'Medium' ? 2 : 1;
    return bROI - aROI;
  });
  if (prioritized.length === 0) {
    // Seed with guidance based on detected gaps
    if (enhanced.predictive.predictiveMetrics.risk_factors?.some((r) => r.factor === 'security_gap')) {
      prioritized.push({ title: 'Add security tasks', roi: 'High' });
    }
    prioritized.push({ title: 'Define p95 latency SLO', roi: 'Medium' });
  }
  return prioritized.slice(0, 10);
}

// ------------------------------ Utils ------------------------------

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function roundTo(n, step) {
  const inv = 1 / step;
  return Math.round(n * inv) / inv;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function containsWord(haystack, word) {
  return new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(haystack);
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&');
}

