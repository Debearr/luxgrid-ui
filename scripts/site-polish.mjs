#!/usr/bin/env node
/**
 * Noidlux – Site Polish (modular, Cursor-ready)
 * Flags: --dry  (no write) | --minify
 */

import fs from 'fs/promises'
import path from 'path'
import { ensureDir, readJsonSafe, writeAtomic } from './lib/utils.mjs'
import { findShots, placeholders } from './lib/gallery.mjs'
import { renderIndex, renderStyles, renderLogo, renderLogoSans } from './lib/templating.mjs'

const DRY = process.argv.includes('--dry')
const MIN = process.argv.includes('--minify')
const PUB = 'public'

await ensureDir(PUB)

// 1) brand (single source of truth)
const defaults = {
  name: 'Noidlux',
  tagline: 'Quiet luxury interfaces.',
  email: 'hello@noidlux.com',
  theme: { bg:'#0b0f1a', panel:'#121828', muted:'#8ca0c8', text:'#e9efff', brand:'#6ea0ff', radius:16, maxWidth:1100, headerHeight:72, gradient:true },
  seo: { description: 'Quiet-luxury UI and market-grade components.', ogImage: '' },
  content: {
    heroTitle: 'Welcome to Noidlux',
    heroBody: 'Deploy a refined static site today. Extend later—no rebuild required.',
    features: [
      { title: 'Fast',   body: 'Static HTML at the edge. No build step.' },
      { title: 'Simple', body: "Edit one file in GitHub and you're done." },
      { title: 'Extend', body: 'Add images/JS now, frameworks later.' }
    ]
  },
  assets: { logoAlt: 'Noidlux wordmark', logoOverride: '' }
}

const brand = await readJsonSafe(path.join(PUB, '_brand.json'), defaults)
const ctx = { ...brand }

// 2) gallery detection
const shots = await findShots(PUB)
ctx.shots = shots
ctx.placeholders = placeholders(3)

// 3) render artifacts
const [html, css, logoSvg, logoSansSvg] = await Promise.all([
  renderIndex(ctx, { minify: MIN }),
  renderStyles(ctx, { minify: MIN }),
  renderLogo({ useOverride: Boolean(brand.assets?.logoOverride) }),
  renderLogoSans()
])

// 4) writes
if (DRY) {
  console.log('💡 DRY RUN — no files written.')
} else {
  await writeAtomic(path.join(PUB, 'index.html'), html)
  await writeAtomic(path.join(PUB, 'styles.css'), css)
  if (!brand.assets?.logoOverride && logoSvg) {
    await writeAtomic(path.join(PUB, 'logo-noidlux.svg'), logoSvg)
    await writeAtomic(path.join(PUB, 'favicon.svg'), logoSvg)
    if (logoSansSvg) {
      await writeAtomic(path.join(PUB, 'logo-noidlux-sans.svg'), logoSansSvg)
    }
  }
}

// 5) logs
console.log('✅ Site polished:')
console.log(`- index.html ${DRY ? '(not written)' : 'updated'}`)
console.log(`- styles.css ${DRY ? '(not written)' : 'written'}`)
console.log(`- logo ${brand.assets?.logoOverride ? 'provided by brand config' : (DRY ? '(not written)' : 'generated')}`)
console.log(`- Gallery: ${shots.length ? `rendered ${shots.length} image(s)` : 'placeholders shown'}`)
console.log(MIN ? '🧼 Minified output' : 'ℹ️  Non-minified output')

