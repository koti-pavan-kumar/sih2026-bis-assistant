import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ChatList from './components/ChatList'
import ChatInterface from './components/ChatInterface'
import RightPanel from './components/RightPanel'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { t } from './utils/translations'

const ACTIVE_CHAT_KEY = 'manakmitra_active_chat'

export default function App() {
  const [page, setPage] = useState('landing')
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('manakmitra_language') || 'en'
  })
  const [activeChatId, setActiveChatId] = useState(() => {
    return localStorage.getItem(ACTIVE_CHAT_KEY) || null
  })
  const [chatRefreshKey, setChatRefreshKey] = useState(0)

  const handleChatUpdated = useCallback(() => {
    setChatRefreshKey(k => k + 1)
  }, [])

  const navigate = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  // Load standards when on main app
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

  const handleChatSelect = useCallback((chatId) => {
    setActiveChatId(chatId)
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
  }, [])

  // Landing page
  if (page === 'landing') {
    return <LandingPage onNavigate={navigate} />
  }

  // Login page
  if (page === 'login') {
    return <LoginPage onNavigate={navigate} />
  }

  // Signup page
  if (page === 'signup') {
    return <SignupPage onNavigate={navigate} />
  }

  // Main app — 3-column layout
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        health={health}
        onHealthUpdate={handleHealthUpdate}
        onMenuToggle={() => setRightPanelOpen(!rightPanelOpen)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNavigate={navigate}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Chat List */}
        <div className="w-64 border-r bg-white flex-shrink-0 hidden md:flex flex-col">
          <ChatList
            onChatSelect={handleChatSelect}
            activeChatId={activeChatId}
            refreshKey={chatRefreshKey}
          />
        </div>

        {/* Center — Chat Messages */}
        <ChatInterface
          language={language}
          chatId={activeChatId}
          onChatUpdated={handleChatUpdated}
        />

        {/* Right Sidebar — Standards / Auto-Fetch / Analytics */}
        <div className="hidden lg:flex">
          <RightPanel
            standards={standards}
            health={health}
            isOpen={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
          />
        </div>
      </div>
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white hide-mobile">
        {t('ministry', language)} | {t('poweredBy', language)}
      </footer>
    </div>
  )
}
