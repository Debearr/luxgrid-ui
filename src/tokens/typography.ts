// Typography tokens
export const typography = {
	fonts: {
		sans: 'SF Pro Display, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji"',
		mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New"',
	},
	sizes: {
		xs: "0.75rem",
		sm: "0.875rem",
		base: "1rem",
		md: "1.125rem",
		lg: "1.25rem",
		xl: "1.5rem",
		"2xl": "1.875rem",
		"3xl": "2.25rem",
	},
	lineHeights: {
		tight: "1.2",
		comfy: "1.35",
		normal: "1.5",
		relaxed: "1.7",
	},
	weights: {
		light: 300,
		regular: 400,
		medium: 500,
		semibold: 600,
		bold: 700,
	},
} as const;

export type TypographyToken = keyof typeof typography;