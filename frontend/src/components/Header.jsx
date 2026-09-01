import React from 'react'

export default function Header({ health }) {
  return (
    <header className="bg-navy text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🇮🇳</div>
        <div>
          <h1 className="text-lg font-bold leading-tight">BIS Standards AI Assistant</h1>
          <p className="text-xs text-blue-200">भारतीय मानकों का AI सहायक — Bureau of Indian Standards</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        {health && (
          <>
            <span className="text-blue-200">{health.indexed_chunks} standards indexed</span>
            <span className="flex items-center gap-1 text-green-300">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span> System healthy
            </span>
          </>
        )}
        <span className="bg-saffron text-white px-3 py-1 rounded-full text-xs font-semibold">SIH 2026</span>
      </div>
    </header>
  )
}
