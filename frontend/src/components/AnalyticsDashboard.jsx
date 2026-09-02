import React, { useState, useEffect } from 'react'

/**
 * AnalyticsDashboard — Shows usage statistics and insights.
 * This is a "future scope" feature that demonstrates the vision
 * for BIS-side analytics (most asked queries, gaps in standards).
 * 
 * In production, this would connect to a real analytics backend.
 * For now, it shows demo data to demonstrate the concept.
 */

// Demo data for showcasing the concept
const DEMO_STATS = {
  total_queries: 1247,
  unique_users: 89,
  avg_response_time: '2.8s',
  languages_used: 8,
  top_standards: [
    { is: 'IS 456:2000', name: 'Plain and Reinforced Concrete', queries: 342, trend: '+12%' },
    { is: 'IS 1786:2008', name: 'High Strength Steel Bars', queries: 289, trend: '+8%' },
    { is: 'IS 269:2015', name: 'Ordinary Portland Cement', queries: 198, trend: '+5%' },
    { is: 'IS 10500:2012', name: 'Drinking Water', queries: 156, trend: '+22%' },
    { is: 'IS 14543:2018', name: 'Milk Safety', queries: 89, trend: '+15%' },
  ],
  language_distribution: [
    { lang: 'Hindi', percent: 45 },
    { lang: 'English', percent: 35 },
    { lang: 'Tamil', percent: 8 },
    { lang: 'Bengali', percent: 5 },
    { lang: 'Others', percent: 7 },
  ],
  common_gaps: [
    'No standard found for: solar panel quality testing',
    'Query about IS 875 (wind loads) — not yet indexed',
    'Users asking about ISO 9001 — not a BIS standard',
  ]
}

export default function AnalyticsDashboard({ health }) {
  const [stats, setStats] = useState(DEMO_STATS)
  const [isDemo, setIsDemo] = useState(true)

  // In production, fetch real analytics from API
  useEffect(() => {
    // fetch('/api/analytics').then(r => r.json()).then(setStats)
  }, [])

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-navy">Analytics Dashboard</h2>
          <p className="text-sm text-gray-500">Usage statistics and insights</p>
        </div>
        {isDemo && (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
            Demo Data
          </span>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-navy">{stats.total_queries.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total Queries</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-700">{stats.unique_users}</div>
          <div className="text-xs text-gray-500">Unique Users</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-700">{stats.avg_response_time}</div>
          <div className="text-xs text-gray-500">Avg Response</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-700">{stats.languages_used}</div>
          <div className="text-xs text-gray-500">Languages Used</div>
        </div>
      </div>

      {/* Top Standards */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">📊 Most Queried Standards</h3>
        <div className="space-y-2">
          {stats.top_standards.map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              <span className="w-6 h-6 bg-navy text-white rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <div className="flex-1">
                <div className="font-semibold text-navy text-sm">{s.is}</div>
                <div className="text-xs text-gray-500">{s.name}</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-navy">{s.queries}</div>
                <div className="text-xs text-green-600">{s.trend}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Distribution */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">🌐 Language Distribution</h3>
        <div className="space-y-2">
          {stats.language_distribution.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-20 text-xs text-gray-600">{l.lang}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-saffron rounded-full transition-all"
                  style={{ width: `${l.percent}%` }}
                ></div>
              </div>
              <span className="text-xs font-semibold text-navy w-10 text-right">{l.percent}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Knowledge Gaps */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3">⚠️ Identified Gaps (Future Enhancement)</h3>
        <div className="space-y-2">
          {stats.common_gaps.map((gap, i) => (
            <div key={i} className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-2 text-xs text-yellow-800">
              {gap}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
