'use client'
import { useEffect, useState } from 'react'

interface MarketData {
  timestamp: string
  executive_brief: string
  scorecard: {
    market_fit: number
    product_readiness: number
    brand_alignment: number
    growth_engine: number
    seo_position: number
    risk: number
  }
  opportunities: Array<{
    title: string
    why_now: string
    segment: string
    expected_impact: string
    confidence: number
    effort_days: number
  }>
  top_5_actions: Array<{
    name: string
    why: string
    roi: string
    difficulty: string
    deadline_days: number
  }>
  seo: {
    priority_keywords: Array<{
      keyword: string
      intent: string
      difficulty: number
      opportunity: string
    }>
  }
  social_drip?: {
    twitter_threads: Array<{
      hook: string
      beats: string[]
      cta: string
    }>
  }
  ensemble_note?: string
}

export default function EnhancedMarketDashboard() {
  const [data, setData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market')
        const marketData = await response.json()
        setData(marketData)
        setLastUpdated(new Date(marketData.timestamp).toLocaleString())
      } catch (error) {
        console.error('Failed to fetch market data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-[#1a2332] rounded w-1/3"></div>
          <div className="h-32 bg-[#1a2332] rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-[#1a2332] rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] p-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white mb-4">No Market Data Available</h1>
          <p className="text-[#a8b2c7]">Waiting for first AI Council analysis...</p>
        </div>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400' 
    return 'text-red-400'
  }

  const getScoreBar = (score: number) => {
    const filled = '█'.repeat(score)
    const empty = '░'.repeat(10 - score)
    return filled + empty
  }

  const getRoiColor = (roi: string) => {
    switch (roi) {
      case 'high': return 'text-green-400 bg-green-400/10'
      case 'med': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 bg-green-400/10'
      case 'med': return 'text-yellow-400 bg-yellow-400/10'
      default: return 'text-red-400 bg-red-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      {/* Header */}
      <div className="border-b border-[#1a2332] p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-semibold">AI Council Market Intelligence</h1>
            <p className="text-[#a8b2c7] mt-1">Last updated: {lastUpdated}</p>
            {data.ensemble_note && (
              <p className="text-[#4a9eff] text-sm mt-1">🤖 {data.ensemble_note}</p>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-[#a8b2c7]">Next Analysis</div>
            <div className="text-lg font-medium">Monday 1:00 PM UTC</div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Executive Brief */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 Executive Brief</h2>
          <p className="text-lg leading-relaxed">{data.executive_brief}</p>
        </section>

        {/* Scorecard */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">🎯 Performance Scorecard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data.scorecard).map(([key, score]) => (
              <div key={key} className="bg-[#0a0e1a] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium capitalize">
                    {key.replace('_', ' ')}
                  </span>
                  <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                    {score}/10
                  </span>
                </div>
                <div className="font-mono text-sm text-[#4a9eff]">
                  {getScoreBar(score)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Top 5 Actions */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">🚀 Priority Actions</h2>
          <div className="space-y-4">
            {data.top_5_actions.map((action, i) => (
              <div key={i} className="bg-[#0a0e1a] rounded-lg p-4 border-l-4 border-[#4a9eff]">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{action.name}</h3>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getRoiColor(action.roi)}`}>
                      {action.roi.toUpperCase()} ROI
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(action.difficulty)}`}>
                      {action.difficulty.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-[#a8b2c7] mb-2">{action.why}</p>
                <div className="text-sm text-[#4a9eff]">
                  📅 Deadline: {action.deadline_days} days
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Opportunities */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">💡 Market Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.opportunities.slice(0, 6).map((opp, i) => (
              <div key={i} className="bg-[#0a0e1a] rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{opp.title}</h3>
                  <div className="text-right">
                    <div className="text-sm text-[#4a9eff]">
                      {Math.round(opp.confidence * 100)}% confidence
                    </div>
                    <div className="text-xs text-[#a8b2c7]">
                      {opp.effort_days}d effort
                    </div>
                  </div>
                </div>
                <p className="text-[#a8b2c7] text-sm mb-2">{opp.why_now}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-[#4a9eff]/20 text-[#4a9eff] px-2 py-1 rounded">
                    {opp.segment}
                  </span>
                  <span className="text-xs text-[#a8b2c7] capitalize">
                    {opp.expected_impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SEO Focus */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">🔍 SEO Priority Keywords</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.seo?.priority_keywords?.slice(0, 6).map((keyword, i) => (
              <div key={i} className="bg-[#0a0e1a] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{keyword.keyword}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    keyword.opportunity === 'high' ? 'text-green-400 bg-green-400/10' :
                    keyword.opportunity === 'med' ? 'text-yellow-400 bg-yellow-400/10' :
                    'text-gray-400 bg-gray-400/10'
                  }`}>
                    {keyword.opportunity.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-[#a8b2c7] mb-1">
                  Intent: <span className="capitalize">{keyword.intent}</span>
                </div>
                <div className="text-sm text-[#4a9eff]">
                  Difficulty: {keyword.difficulty}/100
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Social Content Ideas */}
        {data.social_drip?.twitter_threads && (
          <section className="bg-[#1a2332] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-6">🐦 Twitter Content Pipeline</h2>
            <div className="space-y-4">
              {data.social_drip.twitter_threads.slice(0, 3).map((thread, i) => (
                <div key={i} className="bg-[#0a0e1a] rounded-lg p-4">
                  <h3 className="font-semibold mb-2 text-[#4a9eff]">Thread #{i + 1}</h3>
                  <div className="mb-3">
                    <div className="text-sm text-[#a8b2c7] mb-1">Hook:</div>
                    <div className="font-medium">{thread.hook}</div>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-[#a8b2c7] mb-1">Key Points:</div>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {thread.beats.map((beat, j) => (
                        <li key={j}>{beat}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm text-[#a8b2c7] mb-1">CTA:</div>
                    <div className="text-sm text-[#4a9eff]">{thread.cta}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Quick Actions */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">⚡ 2-Hour Quick Wins</h2>
          <div className="bg-[#0a0e1a] rounded-lg p-4">
            <div className="space-y-3">
              {data.top_5_actions
                .filter(action => action.deadline_days <= 7 && action.difficulty === 'easy')
                .slice(0, 3)
                .map((action, i) => (
                  <div key={i} className="flex items-center space-x-3 p-3 bg-[#1a2332] rounded">
                    <input type="checkbox" className="w-4 h-4 text-[#4a9eff] bg-transparent border-[#4a9eff] rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{action.name}</div>
                      <div className="text-sm text-[#a8b2c7]">{action.why}</div>
                    </div>
                    <div className="text-xs text-[#4a9eff]">{action.deadline_days}d</div>
                  </div>
                ))}
              {data.top_5_actions.filter(action => action.deadline_days <= 7 && action.difficulty === 'easy').length === 0 && (
                <div className="text-center text-[#a8b2c7] py-4">
                  No quick wins identified this week. Focus on medium-term actions above.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* System Status */}
        <section className="bg-[#1a2332] rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">🔄 AI Council Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0a0e1a] rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">🟢</div>
              <div className="text-sm text-[#a8b2c7]">Claude</div>
              <div className="text-xs text-green-400">Active</div>
            </div>
            <div className="bg-[#0a0e1a] rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">🟡</div>
              <div className="text-sm text-[#a8b2c7]">Gemini</div>
              <div className="text-xs text-yellow-400">Standby</div>
            </div>
            <div className="bg-[#0a0e1a] rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">🔵</div>
              <div className="text-sm text-[#a8b2c7]">DeepSeek</div>
              <div className="text-xs text-blue-400">Ready</div>
            </div>
            <div className="bg-[#0a0e1a] rounded-lg p-4 text-center">
              <div className="text-2xl mb-1">⏰</div>
              <div className="text-sm text-[#a8b2c7]">Next Run</div>
              <div className="text-xs text-[#4a9eff]">Monday 1PM</div>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1a2332] p-6 mt-12">
        <div className="flex justify-between items-center text-sm text-[#a8b2c7]">
          <div>
            AI Council Market Intelligence v2.1 • 
            Powered by Claude, Gemini, DeepSeek ensemble
          </div>
          <div>
            <a href="/api/market" className="text-[#4a9eff] hover:underline mr-4">
              Raw JSON
            </a>
            <a href="/dashboard/market" className="text-[#4a9eff] hover:underline">
              Refresh
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

