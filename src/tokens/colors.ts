// LuxGrid color tokens (brand-agnostic core)
export const colors = {
  bg: "#0A0E1A",        // lg-bg
  surface: "#1A2332",   // lg-surface
  gold: "#C9A96E",      // lg-gold
  blue: "#4A9EFF",      // lg-blue
  text: "#FFFFFF",      // lg-text
  muted: "#A8B2C7",     // lg-muted
} as const;

export type ColorToken = keyof typeof colors;
