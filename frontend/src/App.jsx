import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { t } from './utils/translations'

export default function App() {
  const [page, setPage] = useState(() => {
    return localStorage.getItem('manakmitra_page') || 'landing'
  })
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('manakmitra_language') || 'en'
  })

  const navigate = useCallback((newPage) => {
    setPage(newPage)
    localStorage.setItem('manakmitra_page', newPage)
  }, [])

  // Initial load of standards list (only when on main app)
  useEffect(() => {
    if (page === 'app') {
      fetch('/api/standards')
        .then(r => r.json())
        .then(d => setStandards(d.standards || []))
        .catch(() => {})
    }
  }, [page])

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

  // Render landing page
  if (page === 'landing') {
    return <LandingPage onNavigate={navigate} />
  }

  // Render login page
  if (page === 'login') {
    return <LoginPage onNavigate={navigate} />
  }

  // Render signup page
  if (page === 'signup') {
    return <SignupPage onNavigate={navigate} />
  }

  // Render main app
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        health={health}
        onHealthUpdate={handleHealthUpdate}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNavigate={navigate}
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
