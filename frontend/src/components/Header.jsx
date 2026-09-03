import React from 'react'
import ConnectionStatus from './ConnectionStatus'
import LanguageSelector from './LanguageSelector'
import ProfileMenu from './ProfileMenu'
import { t } from '../utils/translations'

export default function Header({ health, onHealthUpdate, onMenuToggle, language, onLanguageChange, onNavigate, darkMode, onToggleDarkMode }) {
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
          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <span className="hidden md:inline-block bg-[#FF9933] text-white px-2.5 py-1 rounded-md text-[10px] font-bold">SIH 2026</span>
          <ProfileMenu onNavigate={onNavigate} />
        </div>
      </header>
    </>
  )
}
