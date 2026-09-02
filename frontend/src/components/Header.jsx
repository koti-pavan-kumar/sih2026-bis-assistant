import React from 'react'
import ConnectionStatus from './ConnectionStatus'

export default function Header({ health, onHealthUpdate }) {
  return (
    <header className="bg-navy text-white px-6 py-3 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="text-2xl">🇮🇳</div>
        <div>
          <h1 className="text-lg font-bold leading-tight">BIS Standards AI Assistant</h1>
          <p className="text-xs text-blue-200">भारतीय मानकों का AI सहायक — ManakMitra</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <ConnectionStatus onHealthUpdate={onHealthUpdate} />
        <span className="bg-saffron text-white px-3 py-1 rounded-full text-xs font-semibold">SIH 2026</span>
      </div>
    </header>
  )
}
