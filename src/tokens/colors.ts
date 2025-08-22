// LuxGrid color tokens (core)
export const colors = {
	bg: "#0A0E1A",
	surface: "#1A2332",
	gold: "#C9A96E",
	blue: "#4A9EFF",
	text: "#FFFFFF",
	muted: "#A8B2C7",
} as const;

export type ColorToken = keyof typeof colors;