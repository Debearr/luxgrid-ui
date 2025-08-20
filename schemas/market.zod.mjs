import { z } from 'zod'

const ScorecardSchema = z.object({
  market_fit: z.number().min(0).max(10),
  product_readiness: z.number().min(0).max(10),
  brand_alignment: z.number().min(0).max(10),
  growth_engine: z.number().min(0).max(10),
  seo_position: z.number().min(0).max(10),
  risk: z.number().min(0).max(10)
})

const OpportunitiesSchema = z.array(z.object({
  title: z.string(),
  why_now: z.string(),
  segment: z.string(),
  expected_impact: z.string(),
  confidence: z.number().min(0).max(1),
  effort_days: z.number().min(0)
}))

const ActionsSchema = z.array(z.object({
  name: z.string(),
  why: z.string(),
  roi: z.enum(['high', 'med', 'low']),
  difficulty: z.enum(['easy', 'med', 'hard']),
  deadline_days: z.number().min(0)
}))

const SeoSchema = z.object({
  priority_keywords: z.array(z.object({
    keyword: z.string(),
    intent: z.string(),
    difficulty: z.number().min(0).max(100),
    opportunity: z.enum(['high', 'med', 'low'])
  }))
})

const SocialDripSchema = z.object({
  twitter_threads: z.array(z.object({
    hook: z.string(),
    beats: z.array(z.string()),
    cta: z.string()
  }))
}).optional()

const DeltasSchema = z.object({
  changed_metrics: z.array(z.object({
    key: z.string(),
    from: z.number(),
    to: z.number()
  }))
}).optional()

export const MarketSchema = z.object({
  timestamp: z.string(),
  status: z.enum(['latest', 'fallback', 'error']).optional(),
  executive_brief: z.string(),
  scorecard: ScorecardSchema,
  opportunities: OpportunitiesSchema,
  top_5_actions: ActionsSchema,
  seo: SeoSchema,
  social_drip: SocialDripSchema,
  deltas: DeltasSchema
})

export default MarketSchema

