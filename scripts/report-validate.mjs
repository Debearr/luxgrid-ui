import { readFile } from 'node:fs/promises'

const path = 'reports/summary.json'
const raw = await readFile(path, 'utf8')
const json = JSON.parse(raw)
if (!json.generatedAt || !json.status) {
  console.error('❌ Invalid report JSON: missing fields')
  process.exit(1)
}
console.log('✅ Report validated')