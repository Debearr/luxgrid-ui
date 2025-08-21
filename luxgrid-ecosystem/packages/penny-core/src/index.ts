export type PersonaLevel = 'beginner' | 'intermediate' | 'expert'

export interface PennyPersonaConfig {
	beginner: string
	intermediate: string
	expert: string
}

export interface PennyPlan {
	confirmation: string
}

export class PennyCore {
	public constructor(private readonly persona: PennyPersonaConfig) {}

	public summarizePlan(plan: string): PennyPlan {
		const trimmed = plan.trim().split(/\s+/).slice(0, 10).join(' ')
		return { confirmation: trimmed }
	}
}