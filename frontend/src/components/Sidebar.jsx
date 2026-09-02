import React, { useState, useCallback } from 'react'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function Sidebar({ standards, health, isOpen, onClose, onNavigate }) {
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [activeTab, setActiveTab] = useState('standards')
  const [fetching, setFetching] = useState(false)
  const [fetchResult, setFetchResult] = useState(null)
  const [fetchHistory, setFetchHistory] = useState(null)

  const suggestions = [
    { text: 'सीमेंट में क्लोराइड की अधिकतम मात्रा?', lang: 'hi' },
    { text: 'What is min yield stress for Fe 500?', lang: 'en' },
    { text: 'IS 456 में water cement ratio?', lang: 'hi' },
    { text: 'Minimum cement content for M20', lang: 'en' },
  ]

  const handleFetchNew = useCallback(async () => {
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

  const handleCheckUpdates = useCallback(async () => {
    try {
      const res = await fetch('/api/fetch-check')
      const data = await res.json()
      setFetchResult(data)
    } catch (err) {
      setFetchResult({ error: err.message })
    }
  }, [])

  const handleLoadHistory = useCallback(async () => {
    try {
      const res = await fetch('/api/fetch-history')
      const data = await res.json()
      setFetchHistory(data.history || [])
    } catch (err) {
      setFetchHistory([])
    }
  }, [])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={onClose}
        ></div>
      )}
      <aside className={`w-64 bg-white border-r flex flex-col overflow-y-auto fixed md:relative z-40 h-full transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
      {/* Home button */}
      <div className="p-3 border-b">
        <button
          onClick={() => onNavigate?.('landing')}
          className="w-full flex items-center gap-2 text-xs text-gray-500 hover:text-[#000080] transition py-1.5 px-2 rounded-lg hover:bg-gray-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Back to Home
        </button>
      </div>

      {/* Tab toggles */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('standards')}
          className={`flex-1 py-2 text-xs font-medium transition ${
            activeTab === 'standards' ? 'text-navy border-b-2 border-navy' : 'text-gray-400'
          }`}
        >
          Standards
        </button>
        <button
          onClick={() => setActiveTab('updates')}
          className={`flex-1 py-2 text-xs font-medium transition ${
            activeTab === 'updates' ? 'text-navy border-b-2 border-navy' : 'text-gray-400'
          }`}
        >
          Auto-Fetch
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 py-2 text-xs font-medium transition ${
            activeTab === 'analytics' ? 'text-navy border-b-2 border-navy' : 'text-gray-400'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Standards Tab */}
      {activeTab === 'standards' && (
        <>
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Try asking:</h2>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                  {s.lang === 'hi' ? '[HI]' : '[EN]'} {s.text}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              Indexed Standards ({standards.length})
            </h2>
            <div className="space-y-2">
              {standards.map((s, i) => (
                <div key={i} className="bg-navy text-white px-3 py-2 rounded-lg text-xs">
                  <div className="font-semibold">{s.is_number}</div>
                  <div className="text-blue-200 text-[10px] truncate">{s.title}</div>
                </div>
              ))}
              {standards.length === 0 && (
                <div className="text-xs text-gray-400 italic">Loading standards...</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Auto-Fetch Tab */}
      {activeTab === 'updates' && (
        <div className="p-4 space-y-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">BIS Auto-Fetch</h2>
            <p className="text-xs text-gray-500 mb-3">
              Automatically discover and ingest new BIS standards from bis.gov.in
            </p>

            <button
              onClick={handleFetchNew}
              disabled={fetching}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition ${
                fetching
                  ? 'bg-yellow-100 text-yellow-700 cursor-wait'
                  : 'bg-saffron hover:bg-saffron-light text-white'
              }`}
            >
              {fetching ? 'Fetching from BIS...' : 'Fetch & Ingest New Standards'}
            </button>

            <button
              onClick={handleCheckUpdates}
              className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              Check for Updates
            </button>

            <button
              onClick={handleLoadHistory}
              className="w-full mt-2 py-2 px-3 rounded-lg text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
            >
              View Fetch History
            </button>
          </div>

          {/* Fetch Result */}
          {fetchResult && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
              {fetchResult.error ? (
                <div className="text-red-600">Error: {fetchResult.error}</div>
              ) : (
                <>
                  <div className="font-semibold text-navy mb-2">Result:</div>
                  {fetchResult.new_standards_found !== undefined && (
                    <div>Found: {fetchResult.new_standards_found} new standards</div>
                  )}
                  {fetchResult.downloaded !== undefined && (
                    <div>Downloaded: {fetchResult.downloaded} PDFs</div>
                  )}
                  {fetchResult.ingested_chunks !== undefined && (
                    <div>Ingested: {fetchResult.ingested_chunks} chunks</div>
                  )}
                  {fetchResult.total_indexed !== undefined && (
                    <div>Total indexed: {fetchResult.total_indexed} standards</div>
                  )}
                  {fetchResult.standards && fetchResult.standards.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fetchResult.standards.map((s, i) => (
                        <div key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-[10px]">
                          {s.is_number}: {s.chunks} chunks
                        </div>
                      ))}
                    </div>
                  )}
                  {fetchResult.errors && fetchResult.errors.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {fetchResult.errors.map((e, i) => (
                        <div key={i} className="bg-red-50 text-red-700 px-2 py-1 rounded text-[10px]">
                          {e}
                        </div>
                      ))}
                    </div>
                  )}
                  {fetchResult.new_items && (
                    <div className="mt-2">
                      <div className="font-semibold text-navy">New on BIS:</div>
                      {fetchResult.new_items.length === 0 ? (
                        <div className="text-gray-500">No new standards found</div>
                      ) : (
                        fetchResult.new_items.slice(0, 5).map((item, i) => (
                          <div key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-[10px] mt-1">
                            {item.is_number}: {item.year || 'No year'}
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Fetch History */}
          {fetchHistory && (
            <div className="bg-gray-50 rounded-lg p-3 text-xs">
              <div className="font-semibold text-navy mb-2">Fetch History ({fetchHistory.length} items):</div>
              {fetchHistory.length === 0 ? (
                <div className="text-gray-500">No items fetched yet</div>
              ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {fetchHistory.slice().reverse().map((item, i) => (
                    <div key={i} className={`px-2 py-1 rounded text-[10px] ${
                      item.pdf_downloaded ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                    }`}>
                      {item.is_number} - {item.pdf_downloaded ? 'Downloaded' : 'Not downloaded'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-3 text-[10px] text-blue-700">
            <strong>How it works:</strong> Click "Fetch & Ingest" to scrape bis.gov.in for new standard
            announcements, download available PDFs, and automatically add them to the searchable index.
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="p-2">
          <AnalyticsDashboard health={health} />
        </div>
      )}
    </aside>
    </>
  )
}
