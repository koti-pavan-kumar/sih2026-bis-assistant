import React, { useState, useEffect } from 'react'
import apiFetch from '../utils/apiFetch'
import { goBack } from '../utils/navigation'

/**
 * StandardsPage — Full-page display of all indexed BIS standards.
 * Shows standards in a professional grid with search and category filtering.
 */
export default function StandardsPage({ onNavigate, darkMode }) {
  const [standards, setStandards] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  // Card detail view — a card opens into the sections actually indexed
  // for that standard (previously the cards were display-only).
  const [detail, setDetail] = useState(null)   // { is_number, title, chunk_count, sections }
  const [detailLoading, setDetailLoading] = useState(false)

  const openDetail = (isNumber) => {
    setDetail({ is_number: isNumber })       // open modal immediately (title fills in)
    setDetailLoading(true)
    fetch(`/api/standards/${encodeURIComponent(isNumber)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(d => setDetail(d || { is_number: isNumber, error: true }))
      .catch(() => setDetail({ is_number: isNumber, error: true }))
      .finally(() => setDetailLoading(false))
  }

  // Close the detail modal with Escape
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setDetail(null)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    apiFetch('/api/standards')
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
            onClick={() => goBack(onNavigate, 'app')}
            className="text-blue-300 hover:text-white text-xs mb-4 flex items-center gap-1"
          >
            ← Back to ManakMitra
          </button>
          <h1 className="text-3xl font-bold mb-2">📚 Indexed BIS Standards</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Browse all Bureau of Indian Standards currently indexed in our knowledge base.{' '}
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
                onClick={() => openDetail(s.is_number)}
                className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#1a2744] dark:hover:border-blue-400 cursor-pointer transition group"
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
                {/* Hover affordance — signals the card opens */}
                <div className="mt-3 text-[10px] font-bold text-[#1a2744] dark:text-blue-300 opacity-0 group-hover:opacity-100 transition">
                  View {s.chunk_count || ''} section{s.chunk_count === 1 ? '' : 's'} →
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= DETAIL MODAL ================= */}
      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setDetail(null)}
        >
          <div
            className="bg-white dark:bg-[#1a1d23] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-200 dark:border-[#2a2d35] bg-gray-50 dark:bg-[#252830]">
              <div>
                <span className="inline-block text-xs font-mono px-2.5 py-1 rounded-lg bg-[#1a2744] dark:bg-blue-900/40 text-white font-bold mb-2">
                  {detail.is_number}
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
                  {detail.title || detail.is_number}
                </h2>
                {!detail.error && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {detail.chunk_count} indexed sections • source text retrieved from BIS publications
                  </p>
                )}
              </div>
              <button
                onClick={() => setDetail(null)}
                className="shrink-0 w-8 h-8 rounded-lg bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] text-gray-500 hover:text-gray-900 dark:hover:text-white hover:border-gray-400 transition text-sm font-bold"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 space-y-4">
              {detailLoading ? (
                <div className="text-center py-10 text-gray-500 text-sm">⏳ Loading sections…</div>
              ) : detail.error ? (
                <div className="text-center py-10 text-red-600 text-sm">Could not load this standard.</div>
              ) : (
                detail.sections.map((sec, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 dark:border-[#2a2d35] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide text-[#1a2744] dark:text-blue-300">
                        {sec.section}
                      </span>
                      {sec.page > 0 && (
                        <span className="text-[10px] font-mono bg-gray-100 dark:bg-[#252830] text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded">
                          Page {sec.page}
                        </span>
                      )}
                    </div>
                    <p className="text-[13px] leading-relaxed text-gray-600 dark:text-gray-300">
                      {sec.excerpt}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
