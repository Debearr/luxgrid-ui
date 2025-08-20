type PlanTask = {
  task: string;
  owner?: string;
  eta_days?: number;
  category?: string;
  metric?: string;
  priority?: string;
  needs_review?: boolean;
};

export function collectReviewItems(plan: { immediate?: PlanTask[]; weeks_2_4?: PlanTask[]; month_2?: PlanTask[] }) {
  const all = [
    ...(plan.immediate ?? []),
    ...(plan.weeks_2_4 ?? []),
    ...(plan.month_2 ?? []),
  ];
  return all.filter(t => !!t.needs_review);
}

export async function openGithubIssues(tasks: PlanTask[]): Promise<string[]> {
  // Placeholder: integrate Octokit if GITHUB_TOKEN is present
  // Return created issue URLs
  return tasks.map((t, i) => `#${i + 1} ${t.task}`);
}

