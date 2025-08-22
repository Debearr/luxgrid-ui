import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'

const path = 'reports/summary.json'
await mkdir(dirname(path), { recursive: true })
const payload = {
  generatedAt: new Date().toISOString(),
  ciRunId: process.env.GITHUB_RUN_ID || null,
  status: 'ok'
}
await writeFile(path, JSON.stringify(payload, null, 2))
console.log('📝 Report generated at', path)