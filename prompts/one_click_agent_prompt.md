#1 — Final One-Click Agent Prompt (v2, Cursor-Ready)

Save as: prompts/one_click_agent_prompt.md
Purpose: Single run → VC scorecard → Gap analysis → Execution plan (JSON/CSV/MD) → Self-validation → Ready for automation & human review

> The orchestrator should pass these handlebars:

{{REPO_SNAPSHOT}} – concatenated prioritized files (already scrubbed)

{{GIT_DIFF_SUMMARY}} – summary of changed files since last run (optional)

{{PREVIOUS_SUMMARY_JSON}} – last run’s summary.json (optional)

{{RUN_MODE}} – "full" or "diff"




# One-Click VC Review → Gaps → Plan (Deterministic, Diff-Aware)

## Role
You are a senior startup/infra architect and investor-style reviewer. Produce **concise, measurable, investor-grade** outputs. No filler. Be deterministic.

## Inputs
- Repo snapshot (code + config + docs, redacted & prioritized):  
  {{REPO_SNAPSHOT}}

- Git diff since last run (optional, may be empty):  
  {{GIT_DIFF_SUMMARY}}

- Previous summary.json (optional, may be empty):  
  {{PREVIOUS_SUMMARY_JSON}}

- Run mode: {{RUN_MODE}}  (allowed: "full" | "diff")

## Context Policy (follow strictly)
- If `RUN_MODE="diff"`, **focus analysis on changed files & affected categories**; reuse prior conclusions elsewhere but call out any assumptions.
- If `RUN_MODE="full"`, analyze holistically.
- If information is missing, **state the assumption explicitly** and propose the minimum probe to confirm it.

## Output Contract (REQUIRED order & formats)

### 1.1 Executive Summary (Markdown)
- 3 wins, 3 risks, 3 top actions (bullets)
- One-liner: “Readiness verdict: <GO | HOLD | NO-GO> (why)”
- If `RUN_MODE="diff"`, add “What changed since last run” (bullets)

### 1.2 Detailed Scores (Markdown Table)
Columns: Category | Score (1-10) | Strengths | Gaps | Risk | Mitigation  
Categories: Tech Architecture, Security & Compliance, Data/Infra, Backend, Frontend, CI/CD & Ops, Performance/Scalability, UX/Polish, Business Model, Market Fit, Financials

### 1.3 Machine-Readable Summary (JSON, code fence)
```json
{
  "run_mode": "full|diff",
  "scores": {
    "tech": 0, "security": 0, "data_infra": 0, "backend": 0, "frontend": 0,
    "ci_cd_ops": 0, "performance": 0, "ux": 0, "business": 0, "market_fit": 0, "financials": 0
  },
  "top_actions": [
    {"title": "", "why": "", "impact": "High|Med|Low", "needs_review": false}
  ],
  "risks": [
    {"risk": "", "severity": "High|Med|Low", "mitigation": ""}
  ],
  "changed_categories": ["tech","security"]  // may be empty on full runs
}
```

---

### 2) Gap Analysis (Per category with score < 10)

#### 2.1 Category Block (Markdown)
**[CATEGORY] – Current: X/10**

**Identified Gaps**
- gap 1
- gap 2

**Path to 10/10**
1. Quick Win (1–2 days): …
2. Medium Impact (≤ 1 week): …
3. High Impact (2–4 weeks): …

**Priority:** High|Medium|Low  
**ROI Impact:** High|Medium|Low  
**Technical Difficulty:** Easy|Medium|Hard  
**Human Review Needed?** Yes|No (mark Yes if security/compliance/legal or >$5k/mo infra change)

#### 2.2 Category JSON (single object, code fence)
```json
{
  "category": "tech|security|data_infra|backend|frontend|ci_cd_ops|performance|ux|business|market_fit|financials",
  "current": 0,
  "priority": "High|Medium|Low",
  "quick_win": {"task": "", "eta_days": 0, "metric": "", "needs_review": false},
  "medium": {"task": "", "eta_days": 0, "metric": "", "needs_review": false},
  "high": {"task": "", "eta_days": 0, "metric": "", "needs_review": false},
  "metrics": ["", ""],
  "demo_impact": "",
  "changed_due_to_diff": true
}
```

---

### 3) Execution Plan

#### 3.1 Immediate Action Checklist (Markdown)
- [ ] Task (owner: TBD) – *ETA: Xd* – **Metric:** … – **Review:** Yes|No

#### 3.2 Week-by-Week Execution (Markdown)
**Week 1:** …  
**Weeks 2–4:** …  
**Month 2:** …

#### 3.3 Plan JSON (code fence)
```json
{
  "immediate": [
    {"task": "", "owner": "TBD", "eta_days": 0, "category": "", "metric": "", "priority": "High", "needs_review": false}
  ],
  "weeks_2_4": [
    {"task": "", "eta_days": 0, "category": "", "metric": "", "priority": "High|Med", "needs_review": false}
  ],
  "month_2": [
    {"task": "", "eta_days": 0, "category": "", "metric": "", "priority": "High|Med|Low", "needs_review": false}
  ]
}
```

#### 3.4 Tracker CSV (code fence, CSV)
```csv
Task,Category,Priority,ETA(days),Owner,Metric,Status,Blocker,Next Action,Needs Review
"","","",0,"TBD","","Pending","","",false
```

#### 3.5 Checklist MD (code fence, MD)
```md
# Execution Checklist
- [ ] Task — ETA Xd — Metric: … — Review: Yes|No
```

---

### 4) Validation Report (Markdown — self-check gate)
- Counts: tasks, missing_eta, missing_metric, missing_priority, invalid_json_blocks
- Violations list (“Task → missing <field>”)
- **Fixes** section proposing corrected values.

---

## Determinism / Quality Gates
- Use **temperature=0** behavior; be consistent and succinct.
- Validate your own JSON before returning; if malformed, **regenerate only the broken section**.
- Prefer explicit, numeric targets (e.g., “p95 API < 200ms”, “CR ≥ 15%”).
- If `RUN_MODE="diff"`, clearly mark items that are **unchanged** vs **changed_due_to_diff**.

## Done
Return sections in strict order: **1.1 → 1.2 → 1.3 → 2 (repeat) → 3.1 → 3.2 → 3.3 → 3.4 → 3.5 → 4**.


---

#2 — Orchestrator Upgrades (TypeScript snippets)

These extend what you already have with Claude’s ideas.

A) Priority-weighted context (and truncation)

// context/selectFiles.ts
const PRIORITY: Array<{glob: string; weight: number}> = [
  { glob: 'package.json', weight: 100 },
  { glob: 'README.md', weight: 95 },
  { glob: 'tsconfig.json', weight: 90 },
  { glob: 'next.config.js', weight: 90 },
  { glob: 'app/**', weight: 85 },
  { glob: 'lib/**', weight: 80 },
  { glob: 'pages/**', weight: 75 },
  { glob: 'api/**', weight: 75 },
  { glob: 'src/**', weight: 70 },
  { glob: 'docs/**', weight: 60 },
  { glob: '**/*', weight: 10 },        // lowest priority fallback
];

export function selectFilesWithBudget(files: FileEntry[], charBudget: number) {
  const sorted = scoreByPriority(files, PRIORITY).sort((a,b)=>b.score-a.score);
  const picked: FileEntry[] = [];
  let used = 0;
  for (const f of sorted) {
    const size = Math.min(f.content.length, f.maxSlice ?? f.content.length);
    if (used + size > charBudget) continue;
    picked.push({...f, content: f.content.slice(0, size)});
    used += size;
  }
  return picked;
}

B) Differential mode (only analyze changes)

// git/diff.ts
export function getDiffSummary(sinceTsFile = '.oneclick-last.json') {
  // load last run commit/time; git diff --name-status; return compact summary
  return { changed: ['app/actions/foo.ts','lib/cache.ts'], deleted: [], added: [] };
}

Pass it to the prompt as {{GIT_DIFF_SUMMARY}} and set RUN_MODE="diff" when changed.length > 0.

C) Output validators (multi-stage)

// validate/index.ts
import { z } from 'zod';

const SummarySchema = z.object({
  run_mode: z.enum(['full','diff']),
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
  top_actions: z.array(z.object({
    title: z.string(),
    why: z.string(),
    impact: z.enum(['High','Med','Low']),
    needs_review: z.boolean()
  })),
  risks: z.array(z.object({
    risk: z.string(), severity: z.enum(['High','Med','Low']), mitigation: z.string()
  })),
  changed_categories: z.array(z.string())
});

export function validateOutputs(blobs: ExtractedBlocks) {
  const issues: string[] = [];
  try { SummarySchema.parse(JSON.parse(blobs.summaryJson)); }
  catch (e) { issues.push(`summary.json invalid: ${e}`); }
  // …repeat for each category JSON, plan.json, tracker.csv headers, etc.
  return issues;
}

D) Caching & reuse

// cache/index.ts
export function loadPreviousSummary() {
  return fs.existsSync('reports/latest/summary.json')
    ? fs.readFileSync('reports/latest/summary.json','utf8')
    : '';
}

export function maybeReuse(planJson: any, runMode: 'full'|'diff') {
  if (runMode === 'diff') {
    // Keep tasks from previous plan for untouched categories
    // Merge intelligently by category + task title
  }
  return planJson;
}

E) Human-review loop

Flag any task with needs_review=true and pause CI or open a GitHub issue automatically.

const flagged = plan.immediate.filter(t => t.needs_review);
// open issue / request approval / Slack notify


---

#3 — .oneclickrc.json (updated)

Add toggles for diff mode, caching, budgets, and redaction:

{
  "charBudget": 180000,
  "runMode": "auto",               // "auto" | "full" | "diff"
  "enableCaching": true,
  "redact": [
    "AKIA[0-9A-Z]{16}",
    "sk-[A-Za-z0-9]{20,}",
    "(?i)password\\s*[:=]\\s*\\S+"
  ],
  "fileGlobs": ["package.json","README.md","tsconfig.json","app/**","lib/**","src/**","docs/**"],
  "maxSliceBytes": 150000
}


---

#4 — What just happened (plain English)

We combined your original prompt + Claude’s upgrades into one master prompt that:

Works in full or diff mode,

Produces strict JSON/CSV/MD blocks you can parse automatically,

Self-checks its own output and proposes fixes if fields are missing,

Tags tasks that need human approval (security, costly infra, legal).


We added smart context selection so important files are always included first, and big/low-value files get trimmed if you’re near the token limit.

We added differential runs: if only a few files changed, the model focuses on them—faster and cheaper.

We added validators (schemas) so your pipeline can fail fast if anything is malformed and ask the model to regenerate only the broken piece.

We added caching and reuse: keep good parts from the last plan when nothing relevant changed.

We added a human-review loop so risky/expensive changes pause for approval.


Result: You click once → get an investor-grade scorecard, a tight action plan with deadlines + success metrics, CSV/MD files ready to track, and a validation report. It’s deterministic, diff-aware, and CI-friendly.


---

If you want, I can also drop in tiny extractor utilities to:

1. grab each fenced block,


2. write files under reports/<timestamp>/, and


3. open PR/issues for needs_review items.