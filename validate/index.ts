import { z } from 'zod';

export type ExtractedBlocks = {
  summaryJson?: string;
  categoryJsons?: string[];
  planJson?: string;
  trackerCsv?: string;
  checklistMd?: string;
};

export const SummarySchema = z.object({
  run_mode: z.enum(['full', 'diff']),
  scores: z.object({
    tech: z.number().min(0).max(10),
    security: z.number().min(0).max(10),
    data_infra: z.number().min(0).max(10),
    backend: z.number().min(0).max(10),
    frontend: z.number().min(0).max(10),
    ci_cd_ops: z.number().min(0).max(10),
    performance: z.number().min(0).max(10),
    ux: z.number().min(0).max(10),
    business: z.number().min(0).max(10),
    market_fit: z.number().min(0).max(10),
    financials: z.number().min(0).max(10),
  }),
  top_actions: z.array(
    z.object({
      title: z.string(),
      why: z.string(),
      impact: z.enum(['High', 'Med', 'Low']),
      needs_review: z.boolean(),
    }),
  ),
  risks: z.array(
    z.object({
      risk: z.string(),
      severity: z.enum(['High', 'Med', 'Low']),
      mitigation: z.string(),
    }),
  ),
  changed_categories: z.array(z.string()),
});

const PLAN_HEADER = 'Task,Category,Priority,ETA(days),Owner,Metric,Status,Blocker,Next Action,Needs Review';

function validateCsvHeaders(csv?: string): string[] {
  if (!csv) return ['tracker.csv missing'];
  const firstLine = csv.split(/\r?\n/)[0] || '';
  return firstLine.trim() === PLAN_HEADER ? [] : [`tracker.csv invalid header: expected: ${PLAN_HEADER}`];
}

export function validateOutputs(blobs: ExtractedBlocks) {
  const issues: string[] = [];
  if (!blobs.summaryJson) {
    issues.push('summary.json missing');
  } else {
    try {
      SummarySchema.parse(JSON.parse(blobs.summaryJson));
    } catch (e: any) {
      issues.push(`summary.json invalid: ${e?.message ?? String(e)}`);
    }
  }

  issues.push(...validateCsvHeaders(blobs.trackerCsv));

  return issues;
}

