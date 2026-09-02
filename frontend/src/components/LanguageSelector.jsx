import React, { useState, useRef, useEffect } from 'react'
import { LANGUAGE_NAMES } from '../utils/translations'

/**
 * LanguageSelector — Dropdown to switch the entire app's language.
 * Stores preference in localStorage and notifies parent of changes.
 *
 * Props:
 * - currentLanguage: string — current language code
 * - onLanguageChange: (lang: string) => void — called when user selects a language
 */
export default function LanguageSelector({ currentLanguage = 'en', onLanguageChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (langCode) => {
    onLanguageChange?.(langCode)
    setIsOpen(false)
    // Save preference
    localStorage.setItem('manakmitra_language', langCode)
  }

  const currentName = LANGUAGE_NAMES[currentLanguage] || 'English'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition text-sm font-medium"
        title="Change language"
      >
        <span className="text-base">
          {currentLanguage === 'en' ? '🌐' : '🇮🇳'}
        </span>
        <span className="hidden sm:inline">{currentName}</span>
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-50 max-h-80 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase border-b">
            Select Language
          </div>
          {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-blue-50 transition ${
                currentLanguage === code ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700'
              }`}
            >
              <span className="text-base">
                {code === 'en' ? '🌐' : '🇮🇳'}
              </span>
              <span>{name}</span>
              {currentLanguage === code && (
                <span className="ml-auto text-blue-600">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
