import React from 'react'
import ConnectionStatus from './ConnectionStatus'
import LanguageSelector from './LanguageSelector'
import { t } from '../utils/translations'

export default function Header({ health, onHealthUpdate, onMenuToggle, language, onLanguageChange, onNavigate }) {
  return (
    <>
      {/* Tricolor accent bar */}
      <div className="h-1 flex">
        <div className="flex-1 bg-[#FF9933]"></div>
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-[#138808]"></div>
      </div>
      <header className="bg-[#000080] text-white px-4 md:px-6 py-2.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1 rounded hover:bg-white/10 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          {/* Logo */}
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-2.5 hover:opacity-90 transition">
            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-[#000080] text-xs font-extrabold">BIS</span>
            </div>
            <div>
              <h1 className="text-sm font-bold leading-tight">ManakMitra</h1>
              <p className="text-[9px] text-blue-200 leading-tight">मानक मित्र — AI Assistant</p>
            </div>
          </button>
        </div>
        <div className="flex items-center gap-2 md:gap-3 text-sm">
          <div className="hidden sm:block">
            <ConnectionStatus onHealthUpdate={onHealthUpdate} language={language} />
          </div>
          <LanguageSelector
            currentLanguage={language}
            onLanguageChange={onLanguageChange}
          />
          <span className="bg-[#FF9933] text-white px-2.5 py-1 rounded-md text-[10px] font-bold">SIH 2026</span>
        </div>
      </header>
    </>
  )
}
