// Shadow tokens — tuned for dark UI
export const shadows = {
  subtle: "0 1px 2px rgba(0,0,0,0.12)",
  medium: "0 6px 16px rgba(0,0,0,0.18)",
  dramatic: "0 16px 40px rgba(0,0,0,0.35)",
} as const;

export type ShadowToken = keyof typeof shadows;
