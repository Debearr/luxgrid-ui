#!/usr/bin/env node
import { ensureDir, writeAtomic } from './lib/utils.mjs'
import fs from 'fs/promises'
import path from 'path'

const files = [
  'scripts/lib/utils.mjs',
  'scripts/lib/gallery.mjs',
  'scripts/lib/templating.mjs',
  'scripts/templates/index.html.tpl',
  'scripts/templates/styles.css.tpl',
  'scripts/templates/logo.svg.tpl'
]

const missing = []
for (const f of files) {
  try { await fs.access(f) } catch { missing.push(f) }
}
if (!missing.length) {
  console.log('✅ All template files already exist.')
  process.exit(0)
}

for (const f of missing) {
  await ensureDir(path.dirname(f))
  await writeAtomic(f, '// template file — populate with content from docs')
  console.log(`🆕 Created ${f}`)
}

