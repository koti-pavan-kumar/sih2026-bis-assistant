import React from 'react'
import ConnectionStatus from './ConnectionStatus'

export default function Header({ health, onHealthUpdate, onMenuToggle }) {
  return (
    <header className="bg-navy text-white px-4 md:px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuToggle}
          className="md:hidden p-1 rounded hover:bg-white/10 transition"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="text-2xl">🇮🇳</div>
        <div>
          <h1 className="text-base md:text-lg font-bold leading-tight">BIS Standards AI Assistant</h1>
          <p className="text-[10px] md:text-xs text-blue-200">भारतीय मानकों का AI सहायक — ManakMitra</p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-4 text-sm">
        <div className="hidden sm:block">
          <ConnectionStatus onHealthUpdate={onHealthUpdate} />
        </div>
        <span className="bg-saffron text-white px-2 md:px-3 py-1 rounded-full text-xs font-semibold">SIH 2026</span>
      </div>
    </header>
  )
}
