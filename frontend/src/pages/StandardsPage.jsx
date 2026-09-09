import React, { useState, useEffect } from 'react'

/**
 * StandardsPage — Full-page display of all indexed BIS standards.
 * Shows standards in a professional grid with search and category filtering.
 */
export default function StandardsPage({ onNavigate, darkMode }) {
  const [standards, setStandards] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/standards')
      .then(r => r.json())
      .then(d => {
        setStandards(d.standards || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = standards.filter(s =>
    (s.is_number || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.title || '').toLowerCase().includes(search.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold mb-2">📚 Indexed BIS Standards</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Browse all Bureau of Indian Standards currently indexed in our knowledge base.
            {standards.length} standards covering steel, cement, food, electrical, textiles, and more.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="Search by standard number (e.g., IS 456) or title (e.g., cement)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-[#1a2744] dark:focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Showing {filtered.length} of {standards.length} standards
          </div>
        </div>

        {/* Standards Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">⏳</div>
            <p className="text-gray-500 text-sm">Loading standards...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-500 text-sm">
              {search ? `No standards matching "${search}"` : 'No standards indexed yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition group"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a2744] dark:bg-blue-900/30 text-white font-bold">
                    {s.is_number}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1 leading-tight">
                  {s.title || s.is_number}
                </h3>
                <p className="text-[10px] text-gray-400 mt-2">
                  {s.section && `Section: ${s.section}`}
                  {s.page && ` • Page ${s.page}`}
                </p>
                {s.score !== undefined && (
                  <div className="mt-3 text-[10px] text-gray-400">
                    Relevance: {(s.score * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
