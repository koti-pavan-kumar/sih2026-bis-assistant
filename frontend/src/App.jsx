import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ChatList from './components/ChatList'
import ChatInterface from './components/ChatInterface'
import RightPanel from './components/RightPanel'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import StandardsPage from './pages/StandardsPage'
import OfficesPage from './pages/OfficesPage'
import CertificationsPage from './pages/CertificationsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import AutoFetchPage from './pages/AutoFetchPage'
import { getActiveChatId, setActiveChatId } from './utils/chatStorage'

export default function App() {
  const [page, setPage] = useState('landing')
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('manakmitra_language') || 'en'
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('manakmitra_dark') === 'true'
  })
  const [activeChatId, setActiveChatIdState] = useState(() => {
    return getActiveChatId()
  })
  const [chatRefreshKey, setChatRefreshKey] = useState(0)

  const handleChatUpdated = useCallback(() => {
    setChatRefreshKey(k => k + 1)
  }, [])

  const navigate = useCallback((newPage) => {
    setPage(newPage)
  }, [])

  // Load standards when on main app or chat page
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

  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      localStorage.setItem('manakmitra_dark', String(!prev))
      return !prev
    })
  }, [])

  const handleChatSelect = useCallback((chatId) => {
    setActiveChatIdState(chatId)
    setActiveChatId(chatId)
  }, [])

  // ─── Auth Pages ───────────────────────────────────────────
  if (page === 'landing') {
    return <LandingPage onNavigate={navigate} />
  }
  if (page === 'login') {
    return <LoginPage onNavigate={navigate} />
  }
  if (page === 'signup') {
    return <SignupPage onNavigate={navigate} />
  }

  // ─── Full-Width Feature Pages ─────────────────────────────
  const fullPages = {
    standards: <StandardsPage onNavigate={navigate} darkMode={darkMode} />,
    offices: <OfficesPage onNavigate={navigate} darkMode={darkMode} />,
    certifications: <CertificationsPage onNavigate={navigate} language={language} darkMode={darkMode} />,
    analytics: <AnalyticsPage onNavigate={navigate} darkMode={darkMode} />,
    'auto-fetch': <AutoFetchPage onNavigate={navigate} darkMode={darkMode} />,
  }

  if (fullPages[page]) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark bg-[#0f1115]' : 'bg-gray-50'}`}>
        <Header
          currentPage={page}
          onNavigate={navigate}
          health={health}
          onHealthUpdate={handleHealthUpdate}
          language={language}
          onLanguageChange={handleLanguageChange}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        {fullPages[page]}
        <footer className="text-center py-3 text-xs text-gray-400 border-t bg-white dark:bg-[#111318]">
          Government of India | Bureau of Indian Standards | ManakMitra AI Assistant
        </footer>
      </div>
    )
  }

  // ─── Main Chat Page (2-column: chats + messages) ──────────
  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-[#0f1115]' : 'bg-gray-50'}`}>
      <Header
        currentPage={page}
        onNavigate={navigate}
        health={health}
        onHealthUpdate={handleHealthUpdate}
        language={language}
        onLanguageChange={handleLanguageChange}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Chat List */}
        <div className="w-64 flex-shrink-0 hidden md:flex flex-col panel-left">
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
      </div>
      
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white dark:bg-[#111318]">
        Government of India | Bureau of Indian Standards | ManakMitra AI Assistant
      </footer>
    </div>
  )
}
