import React, { useState, useCallback, useEffect } from 'react'

/**
 * AutoFetchPage — Full-page auto-fetch management.
 * Fetch new BIS standards from bis.gov.in, check updates, view history.
 */
export default function AutoFetchPage({ onNavigate, darkMode }) {
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState(null)
  const [history, setHistory] = useState(null)
  const [checkResult, setCheckResult] = useState(null)

  const handleFetch = useCallback(async () => {
    setFetching(true)
    setFetchResult(null)
    try {
      const res = await fetch('/api/fetch-new-standards', { method: 'POST' })
      const data = await res.json()
      setFetchResult(data)
    } catch (err) {
      setFetchResult({ error: err.message })
    } finally {
      setFetching(false)
    }
  }, [])

  const handleCheck = useCallback(async () => {
    setCheckResult(null)
    try {
      const res = await fetch('/api/fetch-check')
      const data = await res.json()
      setCheckResult(data)
    } catch (err) {
      setCheckResult({ error: err.message })
    }
  }, [])

  const handleHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/fetch-history')
      const data = await res.json()
      setHistory(data.history || [])
    } catch {
      setHistory([])
    }
  }, [])

  useEffect(() => {
    handleHistory()
  }, [])

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
          <h1 className="text-3xl font-bold mb-2">🔄 Auto-Fetch Standards</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Automatically discover and ingest new BIS standards from bis.gov.in.
            Keep your knowledge base up-to-date with the latest government standards.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* How It Works */}
        <div className="mb-8 bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-6 shadow-sm">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-4">How Auto-Fetch Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: '1', icon: '🔍', title: 'Scan BIS Website', desc: 'Scrapes bis.gov.in for new standard announcements and gazette notifications' },
              { step: '2', icon: '📥', title: 'Download PDFs', desc: 'Downloads available standard PDF documents from BIS servers' },
              { step: '3', icon: '🧠', title: 'Ingest & Index', desc: 'Parses PDFs into chunks, creates embeddings, adds to FAISS vector store' },
              { step: '4', icon: '✅', title: 'Ready to Query', desc: 'New standards are immediately searchable through the AI assistant' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#1a2744] dark:bg-blue-900/30 text-white flex items-center justify-center text-xl mx-auto mb-2">
                  {item.icon}
                </div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={handleFetch}
            disabled={fetching}
            className={`p-6 rounded-xl border-2 transition text-left ${
              fetching
                ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900/10'
                : 'border-[#dd6b20] bg-white dark:bg-[#1a1d23] hover:bg-orange-50 dark:hover:bg-orange-900/10'
            }`}
          >
            <div className="text-2xl mb-2">{fetching ? '⏳' : '🔄'}</div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              {fetching ? 'Fetching from BIS...' : 'Fetch & Ingest New Standards'}
            </h3>
            <p className="text-[10px] text-gray-500 mt-1">
              {fetching ? 'This may take 30-60 seconds' : 'Scrape bis.gov.in for new standards, download PDFs, and index them'}
            </p>
          </button>

          <button
            onClick={handleCheck}
            className="p-6 rounded-xl border-2 border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] hover:border-gray-300 dark:hover:border-gray-500 transition text-left"
          >
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Check for Updates</h3>
            <p className="text-[10px] text-gray-500 mt-1">Quick check — see what new standards are available without downloading</p>
          </button>

          <button
            onClick={handleHistory}
            className="p-6 rounded-xl border-2 border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] hover:border-gray-300 dark:hover:border-gray-500 transition text-left"
          >
            <div className="text-2xl mb-2">📋</div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">View Fetch History</h3>
            <p className="text-[10px] text-gray-500 mt-1">See all previously fetched standards and their status</p>
          </button>
        </div>

        {/* Check Result */}
        {checkResult && (
          <div className="mb-6 bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">🔍 Check Results</h3>
            {checkResult.error ? (
              <div className="text-xs text-red-600 dark:text-red-400">Error: {checkResult.error}</div>
            ) : (
              <div className="text-xs text-gray-700 dark:text-gray-300">
                <pre className="whitespace-pre-wrap">{JSON.stringify(checkResult, null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        {/* Fetch Result */}
        {fetchResult && (
          <div className="mb-6 bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              {fetchResult.error ? '❌ Fetch Error' : '✅ Fetch Results'}
            </h3>
            {fetchResult.error ? (
              <div className="text-xs text-red-600 dark:text-red-400">{fetchResult.error}</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {fetchResult.new_standards_found !== undefined && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-blue-700 dark:text-blue-300">{fetchResult.new_standards_found}</div>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400">New Found</div>
                  </div>
                )}
                {fetchResult.downloaded !== undefined && (
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-green-700 dark:text-green-300">{fetchResult.downloaded}</div>
                    <div className="text-[10px] text-green-600 dark:text-green-400">Downloaded</div>
                  </div>
                )}
                {fetchResult.ingested_chunks !== undefined && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-purple-700 dark:text-purple-300">{fetchResult.ingested_chunks}</div>
                    <div className="text-[10px] text-purple-600 dark:text-purple-400">Chunks Ingested</div>
                  </div>
                )}
                {fetchResult.total_indexed !== undefined && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 text-center">
                    <div className="text-xl font-bold text-orange-700 dark:text-orange-300">{fetchResult.total_indexed}</div>
                    <div className="text-[10px] text-orange-600 dark:text-orange-400">Total Indexed</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* History */}
        {history && (
          <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
              📋 Fetch History ({history.length} items)
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-4">No standards fetched yet. Click "Fetch & Ingest" to start.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {[...history].reverse().map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg text-xs ${
                      item.pdf_downloaded
                        ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-gray-900 dark:text-white">{item.is_number}</span>
                      {item.title && <span className="text-gray-500 ml-2">{item.title}</span>}
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      item.pdf_downloaded
                        ? 'bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {item.pdf_downloaded ? '✓ Downloaded' : '⏳ Pending'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
