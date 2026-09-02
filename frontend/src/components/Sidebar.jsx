import React, { useState } from 'react'
import AnalyticsDashboard from './AnalyticsDashboard'

export default function Sidebar({ standards, health }) {
  const [showAnalytics, setShowAnalytics] = useState(false)

  const suggestions = [
    { text: 'सीमेंट में क्लोराइड की अधिकतम मात्रा?', lang: 'hi' },
    { text: 'What is min yield stress for Fe 500?', lang: 'en' },
    { text: 'IS 456 में water cement ratio?', lang: 'hi' },
    { text: 'Minimum cement content for M20', lang: 'en' },
  ]

  return (
    <aside className="w-64 bg-white border-r flex flex-col overflow-y-auto">
      {/* Toggle */}
      <div className="flex border-b">
        <button
          onClick={() => setShowAnalytics(false)}
          className={`flex-1 py-2 text-xs font-medium transition ${
            !showAnalytics ? 'text-navy border-b-2 border-navy' : 'text-gray-400'
          }`}
        >
          📋 Standards
        </button>
        <button
          onClick={() => setShowAnalytics(true)}
          className={`flex-1 py-2 text-xs font-medium transition ${
            showAnalytics ? 'text-navy border-b-2 border-navy' : 'text-gray-400'
          }`}
        >
          📊 Analytics
        </button>
      </div>

      {showAnalytics ? (
        <div className="p-2">
          <AnalyticsDashboard health={health} />
        </div>
      ) : (
        <>
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Try asking:</h2>
            <div className="space-y-2">
              {suggestions.map((s, i) => (
                <div key={i} className="text-xs bg-blue-50 text-blue-700 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-100 transition">
                  {s.lang === 'hi' ? '🇮🇳' : '🇬🇧'} {s.text}
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
              📋 Indexed Standards ({standards.length})
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
    </aside>
  )
}
