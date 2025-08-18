import fs from 'fs/promises'
import path from 'path'

export async function ensureDir(p) { await fs.mkdir(p, { recursive: true }) }

export async function readJsonSafe(file, fallback = {}) {
  try {
    const raw = await fs.readFile(file, 'utf8')
    const json = JSON.parse(raw)
    console.log(`✅ Loaded ${file}`)
    return json
  } catch (e) {
    console.log(`⚠️  Using defaults; cannot read ${file} (${e.message})`)
    return fallback
  }
}

export async function writeAtomic(file, content) {
  const tmp = `${file}.tmp`
  await fs.writeFile(tmp, content, 'utf8')
  await fs.rename(tmp, file)
}

export function minifyIf(content, should) {
  if (!should) return content
  return content.replace(/\n+/g, '\n').replace(/\s{2,}/g, ' ')
}

export function tpl(str, data) {
  // simple mustache-ish for {{a.b}} and {{#if}} / {{/if}} / {{#each}} blocks
  let out = str

  // booleans
  out = out.replace(/{{#if ([^}]+)}}([\s\S]*?){{\/if}}/g, (_, key, inner) => {
    const val = get(data, key)
    return val ? inner : ''
  })

  // each arrays
  out = out.replace(/{{#each ([^}]+)}}([\s\S]*?){{\/each}}/g, (_, key, inner) => {
    const arr = get(data, key) || []
    return arr.map((item, idx) =>
      inner
        .replace(/{{this}}/g, String(item))
        .replace(/{{@index}}/g, String(idx))
        .replace(/{{this\.([^}]+)}}/g, (m, k) => String(item?.[k] ?? ''))
    ).join('')
  })

  // simple values
  out = out.replace(/{{([^}]+)}}/g, (_, key) => {
    const val = get(data, key.trim())
    return (val === undefined || val === null) ? '' : String(val)
  })

  return out
}

function get(obj, pathStr) {
  return pathStr.split('.').reduce((o, k) => (o ? o[k] : undefined), obj)
}

export async function readTpl(relPath) {
  const abs = path.join('scripts', 'templates', relPath)
  return fs.readFile(abs, 'utf8')
}

