export interface BudgetConfig {
	performance: number
	accessibility: number
}

export interface BugbotOptions {
	budget: BudgetConfig
	autofix: Array<'lint' | 'format' | 'imports'>
}

export class BugbotEngine {
	public constructor(private readonly options: BugbotOptions) {}

	public analyze(): string {
		return `Analyzed with perf>${this.options.budget.performance} and a11y>${this.options.budget.accessibility}`
	}
}