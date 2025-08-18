#!/usr/bin/env node
import fs from 'fs/promises'

async function debugSystem() {
  console.log('🔍 Cursor System Debug\n')

  try {
    const latest = JSON.parse(await fs.readFile('reports/latest.json', 'utf8'))
    console.log('📊 Latest Report:')
    console.log(`  Timestamp: ${latest.timestamp}`)
    console.log(`  Status: ${latest.status || 'latest'}`)
    console.log(`  Brief: ${(latest.executive_brief || '').slice(0, 100)}…`)
    console.log(`  Actions: ${latest.top_5_actions?.length || 0}`)
  } catch { console.log('❌ No reports/latest.json found') }

  try {
    const dirs = (await fs.readdir('reports'))
      .filter(d => /^\d{4}-\d{2}-\d{2}T/.test(d)).sort().slice(-3)
    console.log('\n📁 Recent Reports:'); dirs.forEach((d,i)=>console.log(`  ${i+1}. ${d}`))
  } catch { console.log('\n❌ No reports directory') }

  try {
    const res = await fetch('http://localhost:3000/api/market')
    const data = await res.json()
    console.log('\n🌐 API Health:')
    console.log(`  HTTP: ${res.status}`)
    console.log(`  Status: ${data.status}`)
  } catch { console.log('\n⚠️  API not running (use: npm run dev)') }

  console.log('\n⚙️ Workflows:')
  console.log('  .github/workflows/enhanced-market-scout.yml (weekly)')
  console.log('  .github/workflows/enhanced-market-scout-commit.yml (on push, optional)')
  console.log('\n🎯 Quick Actions:')
  console.log('  npm run cursor:health | npm run cursor:scout | npm run cursor:dashboard | npm run cursor:deploy')
}
debugSystem().catch(console.error)

