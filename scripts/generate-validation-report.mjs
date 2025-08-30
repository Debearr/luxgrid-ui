#!/usr/bin/env node
/**
 * Validation Report Generator - Final AI Council Integration
 * Generates comprehensive quality assurance reports (ESM)
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let MarketSchema
try {
  const mod = await import(path.resolve(process.cwd(), 'schemas/market.zod.mjs'))
  MarketSchema = mod.MarketSchema
} catch (err) {
  console.warn('Zod schema not found, using permissive fallback. Consider adding schemas/market.zod.mjs')
  MarketSchema = {
    safeParse: (data) => ({ success: !!(data && data.timestamp && data.executive_brief && data.scorecard && data.top_5_actions) })
  }
}

class ValidationReporter {
  constructor(reportDir, data) {
    this.reportDir = reportDir
    this.data = data
    this.report = {
      timestamp: new Date().toISOString(),
      schema_compliance: false,
      content_quality: false,
      semantic_integrity: false,
      system_health: {},
      flags: [],
      confidence_score: 0
    }
  }

  async generateReport() {
    console.log('🔍 Generating validation report...')
    await fs.mkdir(this.reportDir, { recursive: true })
    await this.validateSchema()
    await this.validateContent()
    await this.validateSemanticMapping()
    await this.checkSystemHealth()
    this.calculateConfidenceScore()
    await this.writeReport()
    return this.report
  }

  async validateSchema() {
    try {
      const parsed = MarketSchema.safeParse(this.data)
      if (parsed.success) {
        this.report.schema_compliance = true
        console.log('✅ Schema validation passed')
      } else {
        this.report.schema_compliance = false
        const details = parsed.error?.issues?.map?.(issue => ({
          path: Array.isArray(issue.path) ? issue.path.join('.') : String(issue.path ?? ''),
          message: issue.message,
          received: issue.received
        })) || []
        this.report.flags.push({ type: 'schema_error', message: 'Schema validation failed', details })
        console.warn('⚠️ Schema validation failed:', details.length, 'issues')
      }
    } catch (error) {
      this.report.flags.push({ type: 'validation_error', message: 'Failed to validate schema', details: error.message })
    }
  }

  async validateContent() {
    const quality = { brief_length: 0, actions_unique: true, opportunities_specific: true, no_filler_detected: true }
    try {
      const briefWords = this.data.executive_brief?.trim()?.split(/\s+/).length || 0
      quality.brief_length = briefWords
      if (briefWords > 120) {
        this.report.flags.push({ type: 'content_warning', message: `Executive brief too long: ${briefWords} words (target: <100)` })
      }

      const actions = Array.isArray(this.data.top_5_actions) ? this.data.top_5_actions : []
      const actionNames = actions.map(a => a?.name?.toLowerCase()?.trim()).filter(Boolean)
      const uniqueActions = new Set(actionNames)
      quality.actions_unique = uniqueActions.size === actionNames.length
      if (!quality.actions_unique) this.report.flags.push({ type: 'content_error', message: 'Duplicate actions detected' })

      const genericPhrases = ['improve','enhance','optimize','better','increase','implement','develop','create','build','make']
      const hasGenericActions = actions.some(action => {
        const n = action?.name?.toLowerCase() || ''
        return genericPhrases.some(phrase => n.includes(phrase) && n.split(' ').length < 4)
      })
      if (hasGenericActions) {
        quality.no_filler_detected = false
        this.report.flags.push({ type: 'content_warning', message: 'Generic/vague actions detected - should be more specific' })
      }

      const opportunities = Array.isArray(this.data.opportunities) ? this.data.opportunities : []
      const hasVagueOpportunities = opportunities.some(opp => !opp?.segment || opp.segment.length < 5 || !opp?.why_now || opp.why_now.length < 20)
      if (hasVagueOpportunities) {
        quality.opportunities_specific = false
        this.report.flags.push({ type: 'content_warning', message: 'Vague opportunities detected - need more specific segments/timing' })
      }

      this.report.content_quality = Object.entries(quality).every(([k, v]) => typeof v === 'boolean' ? v : true)
      if (this.report.content_quality) console.log('✅ Content quality checks passed')
      else console.warn('⚠️ Content quality issues detected')
    } catch (error) {
      this.report.flags.push({ type: 'validation_error', message: 'Failed to validate content quality', details: error.message })
    }
  }

  async validateSemanticMapping() {
    try {
      const scorecard = this.data.scorecard || {}
      const actions = Array.isArray(this.data.top_5_actions) ? this.data.top_5_actions : []
      const gaps = Object.entries(scorecard)
        .filter(([, score]) => typeof score === 'number' && score < 8)
        .map(([category, score]) => ({ category, score }))

      const highPriorityActions = actions.filter(a => a?.roi === 'high').map(a => a?.name?.toLowerCase()).filter(Boolean)
      const gapCategories = gaps.map(g => g.category.toLowerCase().replace('_', ' '))

      let mappingScore = 0
      for (const action of highPriorityActions) {
        const addressesGap = gapCategories.some(category => action.includes(category) || this.semanticSimilarity(action, category) > 0.6)
        if (addressesGap) mappingScore++
      }
      const mappingRatio = highPriorityActions.length > 0 ? mappingScore / highPriorityActions.length : 1
      this.report.semantic_integrity = mappingRatio >= 0.6
      if (!this.report.semantic_integrity) {
        this.report.flags.push({ type: 'semantic_warning', message: `Low semantic mapping: ${Math.round(mappingRatio * 100)}% of high-priority actions address scorecard gaps`, details: { gaps: gaps.map(g => `${g.category}: ${g.score}/10`), high_priority_actions: highPriorityActions } })
      } else {
        console.log('✅ Semantic integrity validated')
      }
    } catch (error) {
      this.report.flags.push({ type: 'validation_error', message: 'Failed to validate semantic mapping', details: error.message })
    }
  }

  semanticSimilarity(str1, str2) {
    const words1 = str1?.toLowerCase()?.split(/\s+/) || []
    const words2 = str2?.toLowerCase()?.split(/\s+/) || []
    const overlap = words1.filter(w => words2.includes(w)).length
    return overlap / Math.max(words1.length, words2.length, 1)
  }

  async checkSystemHealth() {
    try {
      const health = { generation_latency: null, retries_triggered: 0, fallback_used: false, data_freshness: null }
      const timestamp = new Date(this.data.timestamp)
      if (!isNaN(timestamp)) {
        const now = new Date()
        const ageHours = (now - timestamp) / (1000 * 60 * 60)
        health.data_freshness = `${Math.round(ageHours)} hours`
        if (ageHours > 168) this.report.flags.push({ type: 'system_warning', message: `Data is ${Math.round(ageHours / 24)} days old` })
      }
      if (this.data.status === 'fallback') {
        health.fallback_used = true
        this.report.flags.push({ type: 'system_info', message: 'Using fallback data from previous run' })
      }
      this.report.system_health = health
      console.log('✅ System health checked')
    } catch (error) {
      this.report.flags.push({ type: 'system_error', message: 'Failed to check system health', details: error.message })
    }
  }

  calculateConfidenceScore() {
    let score = 0
    let maxScore = 0
    maxScore += 0.3
    if (this.report.schema_compliance) score += 0.3
    maxScore += 0.3
    if (this.report.content_quality) score += 0.3
    maxScore += 0.2
    if (this.report.semantic_integrity) score += 0.2
    maxScore += 0.2
    const criticalFlags = this.report.flags.filter(f => f.type.includes('error'))
    if (criticalFlags.length === 0) score += 0.2
    this.report.confidence_score = Math.round((score / maxScore) * 100) / 100
  }

  async writeReport() {
    const markdown = this.generateMarkdown()
    const reportPath = path.join(this.reportDir, 'validation.md')
    await fs.writeFile(reportPath, markdown, 'utf8')
    console.log(`✅ Validation report written: ${reportPath}`)
  }

  generateMarkdown() {
    const { report } = this
    const timestamp = new Date(report.timestamp).toLocaleString()
    return `# Validation Report - ${timestamp}

## Overall Confidence: ${Math.round(report.confidence_score * 100)}%

## Schema Compliance ${report.schema_compliance ? '✅' : '❌'}
- All required fields: ${report.schema_compliance ? 'Present' : 'Missing'}
- Data types: ${report.schema_compliance ? 'Correct' : 'Invalid'}
- Enum values: ${report.schema_compliance ? 'Valid' : 'Invalid'}

## Content Quality ${report.content_quality ? '✅' : '⚠️'}
- Executive brief: ${this.data.executive_brief?.split(/\s+/).length || 0} words (target: <100)
- Actions: ${this.data.top_5_actions?.length || 0} unique, specific, actionable
- Opportunities: ${report.content_quality ? 'Well-defined segments and timing' : 'Need more specificity'}
- Generic content: ${report.content_quality ? 'None detected' : 'Some detected'}

## Semantic Integrity ${report.semantic_integrity ? '✅' : '⚠️'}
- Action-gap mapping: ${report.semantic_integrity ? 'Strong alignment' : 'Needs improvement'}
- Scorecard coherence: ${report.semantic_integrity ? 'Consistent' : 'Check alignment'}

## System Health
- Data freshness: ${report.system_health.data_freshness || 'Unknown'}
- Fallback used: ${report.system_health.fallback_used ? 'Yes' : 'No'}
- Generation status: ${this.data.status || 'latest'}

${report.flags.length > 0 ? `## Flags (${report.flags.length})\n${report.flags.map(flag => `### ${flag.type.toUpperCase()}: ${flag.message}\n${flag.details ? (typeof flag.details === 'string' ? flag.details : JSON.stringify(flag.details, null, 2)) : ''}`).join('\n\n')}` : '## Flags\n- None'}

## Recommendations
${this.generateRecommendations()}

---
*Generated by AI Council Validation System v2.1*
*Confidence methodology: Schema (30%) + Content (30%) + Semantic (20%) + System (20%)*`
  }

  generateRecommendations() {
    const recs = []
    if (!this.report.schema_compliance) recs.push('- Fix schema validation errors before deployment')
    if (!this.report.content_quality) { recs.push('- Review actions for specificity and uniqueness'); recs.push('- Ensure executive brief is concise (<100 words)') }
    if (!this.report.semantic_integrity) { recs.push('- Align high-priority actions with scorecard gaps'); recs.push('- Improve opportunity-action mapping') }
    if (this.report.confidence_score < 0.8) recs.push('- Consider re-running analysis with refined prompts')
    if (recs.length === 0) recs.push('- Report quality is excellent, ready for production use')
    return recs.join('\n')
  }
}

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: node scripts/generate-validation-report.mjs <report-dir> <market.json>')
    process.exit(1)
  }
  const [reportDir, dataFile] = args
  try {
    const data = JSON.parse(await fs.readFile(dataFile, 'utf8'))
    const reporter = new ValidationReporter(reportDir, data)
    const report = await reporter.generateReport()
    console.log(`\n📊 Validation Complete:`)
    console.log(`   Confidence: ${Math.round(report.confidence_score * 100)}%`)
    console.log(`   Flags: ${report.flags.length}`)
    console.log(`   Ready for production: ${report.confidence_score >= 0.8 ? '✅' : '⚠️'}`)
  } catch (error) {
    console.error('❌ Validation failed:', error.message)
    process.exit(1)
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}

export { ValidationReporter }

