// LuxGrid typography tokens
export const typography = {
  fonts: {
    heading: 'SF Pro Display, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Inter, Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    body: 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  sizes: {
    xs: "0.75rem",   // 12
    sm: "0.875rem",  // 14
    base: "1rem",    // 16
    lg: "1.125rem",  // 18
    xl: "1.25rem",   // 20
    "2xl": "1.5rem", // 24
    "3xl": "1.875rem", // 30
    "4xl": "2.25rem",  // 36
  },
  lineHeights: {
    tight: "1.2",
    snug: "1.35",
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
