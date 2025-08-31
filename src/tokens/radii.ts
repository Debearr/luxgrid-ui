export const radii = {
  none: '0',
  sm: '12px',
  base: '18px',
  lg: '26px',
  full: '9999px',
} as const

export type RadiiToken = keyof typeof radii