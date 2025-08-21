export const tokens = {
	colors: {
		gold: '#C5A572',
		ink: '#111111',
		ivory: '#FAFAF9'
	},
	radius: {
		s: '8px',
		m: '12px',
		l: '16px'
	}
}

export function withNoidPreset() {
	return {
		theme: {
			extend: {
				colors: {
					gold: tokens.colors.gold,
					ink: tokens.colors.ink,
					ivory: tokens.colors.ivory
				},
				borderRadius: tokens.radius
			}
		}
	}
}