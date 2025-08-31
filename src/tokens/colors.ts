export const colors = {
  bg: '#0c0f16',
  bgElev: '#111626',
  text: '#e7ecf4',
  muted: '#98a2b3',
  brand: '#56e5d6',
  brand2: '#8cb8ff',
  gold: '#f2c14e',
} as const

export type ColorToken = keyof typeof colors