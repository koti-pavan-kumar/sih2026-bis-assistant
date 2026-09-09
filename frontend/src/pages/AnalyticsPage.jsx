import React, { useState, useEffect } from 'react'

/**
 * AnalyticsPage — Full-page analytics dashboard.
 * Shows real system stats and planned analytics features.
 */
export default function AnalyticsPage({ onNavigate, darkMode }) {
  const [health, setHealth] = useState(null)
  const [standards, setStandards] = useState([])

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => setHealth(d))
      .catch(() => {})
    fetch('/api/standards')
      .then(r => r.json())
      .then(d => setStandards(d.standards || []))
      .catch(() => {})
  }, [])

  const domains = {}
  standards.forEach(s => {
    const title = (s.title || '').toLowerCase()
    let domain = 'Other'
    if (title.includes('steel') || title.includes('iron') || title.includes('metal')) domain = 'Steel & Metals'
    else if (title.includes('cement') || title.includes('concrete') || title.includes('brick')) domain = 'Cement & Construction'
    else if (title.includes('milk') || title.includes('food') || title.includes('spice') || title.includes('oil')) domain = 'Food Products'
    else if (title.includes('electric') || title.includes('wire') || title.includes('cable')) domain = 'Electrical'
    else if (title.includes('textile') || title.includes('fabric') || title.includes('yarn')) domain = 'Textiles'
    else if (title.includes('leather') || title.includes('footwear')) domain = 'Leather'
    else if (title.includes('jewel') || title.includes('gold') || title.includes('silver')) domain = 'Jewellery'
    else if (title.includes('glass') || title.includes('ceramic')) domain = 'Glass & Ceramics'
    domains[domain] = (domains[domain] || 0) + 1
  })

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a2744] via-[#1e3a5f] to-[#0f1a2e] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => onNavigate('app')}
            className="text-blue-300 hover:text-white text-xs mb-4 flex items-center gap-1"
          >
            ← Back to ManakMitra
          </button>
          <h1 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Real-time system statistics and usage insights for the ManakMitra platform.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* System Health */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">System Health</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-[#1a2744] dark:text-blue-300">{health?.standards || 0}</div>
              <div className="text-xs text-gray-500 mt-1">Standards Indexed</div>
              <div className="text-[10px] text-green-600 mt-1">✓ Active</div>
            </div>
            <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-green-600">{health?.indexed_chunks || 0}</div>
              <div className="text-xs text-gray-500 mt-1">Knowledge Chunks</div>
              <div className="text-[10px] text-gray-400 mt-1">FAISS vector store</div>
            </div>
            <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-[#dd6b20]">22</div>
              <div className="text-xs text-gray-500 mt-1">Languages</div>
              <div className="text-[10px] text-gray-400 mt-1">Indian + English</div>
            </div>
            <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 text-center shadow-sm">
              <div className="text-3xl font-bold text-purple-600">{health?.indexed_chunks ? Math.round(health.indexed_chunks / 5) : 0}</div>
              <div className="text-xs text-gray-500 mt-1">Avg Chunks/Standard</div>
              <div className="text-[10px] text-gray-400 mt-1">RAG retrieval</div>
            </div>
          </div>
        </div>

        {/* LLM Status */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">AI Engine Status</h2>
          <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">LLM Provider</span>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                  {health?.llm_provider === 'gemini' ? '🟢 Google Gemini' : health?.llm_provider === 'ollama' ? '🟡 Ollama (Local)' : '⚪ Template Mode'}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">Embedding Model</span>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">all-MiniLM-L6-v2 (ONNX)</div>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 uppercase">Vector Store</span>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">FAISS (CPU)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Domain Distribution */}
        <div className="mb-8">
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">Standards by Domain</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(domains).sort((a, b) => b[1] - a[1]).map(([domain, count]) => (
              <div key={domain} className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-4 shadow-sm">
                <div className="text-lg font-bold text-[#1a2744] dark:text-blue-300">{count}</div>
                <div className="text-[11px] text-gray-500">{domain}</div>
                <div className="mt-2 h-1.5 bg-gray-100 dark:bg-[#2a2d35] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1a2744] dark:bg-blue-400 rounded-full transition-all"
                    style={{ width: `${(count / standards.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Scope */}
        <div>
          <h2 className="text-sm font-bold text-gray-500 uppercase mb-4">📈 Planned Analytics (Future Scope)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { icon: '📊', title: 'Most-Queried Standards', desc: 'Identify which standards MSMEs ask about most — helps BIS prioritize clarity' },
              { icon: '🌐', title: 'Language Distribution', desc: 'Track which languages are used most — helps BIS create more regional content' },
              { icon: '⚠️', title: 'Awareness Gaps', desc: 'Standards with low awareness — helps BIS prioritize public education campaigns' },
              { icon: '📈', title: 'Compliance Patterns', desc: 'Query trends and compliance patterns across MSMEs in different states' },
              { icon: '🏭', title: 'Industry Breakdown', desc: 'Which industries query most — steel, food, textiles, electronics' },
              { icon: '🗺️', title: 'Geographic Heatmap', desc: 'State-wise query density — identifies regions needing more BIS outreach' },
            ].map((item, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1d23] border border-dashed border-gray-300 dark:border-[#2a2d35] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">{item.title}</h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
