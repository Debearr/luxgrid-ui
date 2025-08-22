import assert from 'node:assert'

const url = process.env.NEXT_PUBLIC_BASE_URL

if (!url) {
  console.log('ℹ️  Skipping smoke: NEXT_PUBLIC_BASE_URL not set (library repo).')
  process.exit(0)
}

const res = await fetch(url)
const html = await res.text()
assert.match(html, /<html/i, 'No HTML found')
assert.doesNotMatch(html, /<body>\s*<\/body>/i, 'Blank body')
console.log('✅ Smoke passed:', url)