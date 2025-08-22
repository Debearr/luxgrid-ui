// Corner radius tokens
export const radii = {
	none: "0px",
	sm: "6px",
	md: "8px",
	lg: "12px",
	xl: "16px",
	full: "9999px",
} as const;

export type RadiusToken = keyof typeof radii;