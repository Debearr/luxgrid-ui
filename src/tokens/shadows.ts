export const shadows = {
  none: 'none',
  sm: '0 2px 8px rgba(0,0,0,.15)',
  base: '0 10px 30px rgba(0,0,0,.45)',
  lg: '0 15px 40px rgba(0,0,0,.6)',
  xl: '0 25px 50px rgba(0,0,0,.8)',
} as const

export type ShadowToken = keyof typeof shadows