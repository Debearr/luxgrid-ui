#!/usr/bin/env node
/**
 * Cursor Health Check - Validates system readiness before deployment
 * Run this in Cursor to ensure everything is configured correctly
 */
import fs from 'fs/promises'
import { execSync } from 'child_process'

const REQUIRED_FILES = [
  'prompts/system.txt',
  'prompts/user.txt',
  'prompts/schema-validator.txt',
  'prompts/integrity-checker.txt',
  'schemas/market.zod.ts',
  'lib/logger.ts',
  'scripts/market-scout.js',
  'app/api/market/route.ts'
]

const REQUIRED_SECRETS = ['ANTHROPIC_API_KEY']
const OPTIONAL_SECRETS = ['GEMINI_API_KEY', 'SLACK_WEBHOOK_URL']

async function checkFiles() {
  console.log('📁 Checking required files...')
  const missing = []
  for (const f of REQUIRED_FILES) {
    try { await fs.access(f); console.log(`✅ ${f}`) }
    catch { console.log(`❌ ${f}`); missing.push(f) }
  }
  return missing.length === 0
}

async function checkSecrets() {
  console.log('\n🔐 Checking environment secrets...')
  const missing = []
  for (const s of REQUIRED_SECRETS) {
    if (process.env[s]) console.log(`✅ ${s} (configured)`)
    else { console.log(`❌ ${s} (missing)`); missing.push(s) }
  }
  for (const s of OPTIONAL_SECRETS)
    console.log(process.env[s] ? `✅ ${s} (optional, configured)` : `⚠️  ${s} (optional, not configured)`)
  return missing.length === 0
}

async function checkDependencies() {
  console.log('\n📦 Checking dependencies...')
  try {
    execSync('npm list @anthropic-ai/sdk zod pino', { stdio: 'pipe' })
    console.log('✅ All required packages installed')
    return true
  } catch {
    console.log('❌ Missing deps – run: npm install @anthropic-ai/sdk zod pino')
    return false
  }
}

async function testApi() {
  console.log('\n🤖 Testing Anthropic API...')
  if (!process.env.ANTHROPIC_API_KEY) { console.log('⚠️  Skipping – ANTHROPIC_API_KEY not set'); return true }
  try {
    const { default: Anthropic } = await import('@anthropic-ai/sdk')
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    await client.messages.create({
      model: process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20240620',
      max_tokens: 10,
      messages: [{ role: 'user', content: 'ping' }]
    })
    console.log('✅ Anthropic API ok')
    return true
  } catch (e) {
    console.log(`❌ API test failed: ${e.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Cursor Deployment Health Check\n')
  const filesOk = await checkFiles()
  const secretsOk = await checkSecrets()
  const depsOk = await checkDependencies()
  const apiOk = await testApi()

  console.log('\n📊 Summary:')
  console.log(`Files: ${filesOk ? '✅' : '❌'}`)
  console.log(`Secrets: ${secretsOk ? '✅' : '❌'}`)
  console.log(`Dependencies: ${depsOk ? '✅' : '❌'}`)
  console.log(`API: ${apiOk ? '✅' : '❌'}`)

  const ready = filesOk && secretsOk && depsOk && apiOk
  console.log(`\n🎯 Deployment Ready: ${ready ? '✅ YES' : '❌ NO'}`)
  if (ready) {
    console.log('\nNext:')
    console.log('1) git add . && git commit -m "deploy" && git push')
    console.log('2) Actions → Enhanced Market Scout → Run workflow (or use on-commit)')
    console.log('3) Verify /reports/latest.json & dashboard')
  }
  process.exit(ready ? 0 : 1)
}

main().catch(console.error)

