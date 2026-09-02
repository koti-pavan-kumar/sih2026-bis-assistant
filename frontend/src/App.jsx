import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import { t } from './utils/translations'

export default function App() {
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState(() => {
    // Load saved language preference
    return localStorage.getItem('manakmitra_language') || 'en'
  })

  // Initial load of standards list
  useEffect(() => {
    fetch('/api/standards')
      .then(r => r.json())
      .then(d => setStandards(d.standards || []))
      .catch(() => {})
  }, [])

  // Callback from ConnectionStatus component
  const handleHealthUpdate = (healthData) => {
    setHealth(healthData)
    if (healthData) {
      fetch('/api/standards')
        .then(r => r.json())
        .then(d => setStandards(d.standards || []))
        .catch(() => {})
    }
  }

  const handleLanguageChange = useCallback((lang) => {
    setLanguage(lang)
    localStorage.setItem('manakmitra_language', lang)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        health={health}
        onHealthUpdate={handleHealthUpdate}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        language={language}
        onLanguageChange={handleLanguageChange}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          standards={standards}
          health={health}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          language={language}
        />
        <ChatInterface language={language} />
      </div>
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white hide-mobile">
        {t('ministry', language)} | {t('poweredBy', language)}
      </footer>
    </div>
  )
}
