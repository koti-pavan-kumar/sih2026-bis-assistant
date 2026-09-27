import React, { useState } from 'react'
import ConnectionStatus from './ConnectionStatus'
import LanguageSelector from './LanguageSelector'
import ProfileMenu from './ProfileMenu'
import { t } from '../utils/translations'

const NAV_ITEMS = [
  { id: 'app', labelKey: 'chat', shortLabel: 'Chat' },
  { id: 'standards', labelKey: 'standards', shortLabel: 'Standards' },
  { id: 'certifications', labelKey: 'navCertifications', shortLabel: 'Certs' },
  { id: 'offices', labelKey: 'navTestingCentres', shortLabel: 'Offices' },
  { id: 'auto-fetch', labelKey: 'autoFetch', shortLabel: 'Fetch' },
  { id: 'analytics', labelKey: 'analytics', shortLabel: 'Analytics' },
]

const NAV_ICONS = {
  app: '💬', standards: '📚', certifications: '📋',
  offices: '🔬', 'auto-fetch': '🔄', analytics: '📊',
}

export default function Header({ currentPage, onNavigate, health, onHealthUpdate, language, onLanguageChange, darkMode, onToggleDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Tricolor accent bar */}
      <div className="tricolor-bar"></div>
      
      {/* Main Header */}
      <header className="bg-[#1a2744] dark:bg-[#0f1a2e] text-white shadow-lg sticky top-0 z-50">
        {/* Top bar — Logo + Actions */}
        <div className="px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
                )}
              </svg>
            </button>
            
            {/* Logo */}
            <button onClick={() => onNavigate('landing')} className="flex items-center gap-3 hover:opacity-90 transition">
              <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-[#1a2744] text-sm font-extrabold">BIS</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold leading-tight tracking-wide">ManakMitra</h1>
                <p className="text-[11px] text-blue-200/70 leading-tight mt-0.5">मानक मित्र — AI Assistant</p>
              </div>
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden sm:block">
              <ConnectionStatus onHealthUpdate={onHealthUpdate} language={language} />
            </div>
            <LanguageSelector currentLanguage={language} onLanguageChange={onLanguageChange} />
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg hover:bg-white/10 transition"
              title={darkMode ? 'Light mode' : 'Dark mode'}
            >
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            <span className="hidden md:inline-block bg-[#dd6b20] text-white px-2.5 py-1 rounded text-[11px] font-bold">SIH 2026</span>
            <ProfileMenu onNavigate={onNavigate} />
          </div>
        </div>

        {/* Navigation Bar — Desktop */}
        <nav className="hidden md:flex border-t border-white/10 px-4 md:px-6">
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-5 py-3 text-sm font-medium transition border-b-2 ${
                currentPage === item.id
                  ? 'text-white border-[#dd6b20] bg-white/5'
                  : 'text-blue-200/70 border-transparent hover:text-white hover:bg-white/5'
              }`}
            >
              {NAV_ICONS[item.id]} {t(item.labelKey, language)}
            </button>
          ))}
        </nav>

        {/* Mobile Navigation — Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-white/10 bg-[#162036] dark:bg-[#0c1525]">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false) }}
                className={`w-full px-4 py-3 text-left text-sm transition border-l-3 ${
                  currentPage === item.id
                    ? 'text-white bg-white/10 border-l-[#dd6b20]'
                    : 'text-blue-200/70 hover:text-white hover:bg-white/5 border-l-transparent'
                }`}
              >
                {NAV_ICONS[item.id]} {t(item.labelKey, language)}
              </button>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
