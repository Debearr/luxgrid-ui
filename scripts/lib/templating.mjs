import { readTpl, tpl, minifyIf } from './utils.mjs'

export async function renderIndex(ctx, { minify = false } = {}) {
  const htmlTpl = await readTpl('index.html.tpl')
  return minifyIf(tpl(htmlTpl, ctx), minify)
}

export async function renderStyles(ctx, { minify = false } = {}) {
  const cssTpl = await readTpl('styles.css.tpl')
  return minifyIf(tpl(cssTpl, ctx), minify)
}

export async function renderLogo({ useOverride } = {}) {
  if (useOverride) return null // caller will copy brand-provided logo
  return await readTpl('logo.svg.tpl')
}

export async function renderLogoSans() {
  return await readTpl('logo-sans.svg.tpl')
}

