import React, { useState, useEffect, useCallback } from 'react'
import Header from './components/Header'
import ChatList from './components/ChatList'
import ChatInterface from './components/ChatInterface'
import RightPanel from './components/RightPanel'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { t } from './utils/translations'
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
  const [openWizard, setOpenWizard] = useState(false)

  const handleChatUpdated = useCallback(() => {
    setChatRefreshKey(k => k + 1)
  }, [])

  const handleOpenWizard = useCallback(() => {
    setOpenWizard(true)
    // Reset after a tick so it can be triggered again
    setTimeout(() => setOpenWizard(false), 100)
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
    <div className={`flex flex-col h-screen ${darkMode ? 'dark bg-[#0f1115]' : 'bg-gray-50'}`}>
      <Header
        health={health}
        onHealthUpdate={handleHealthUpdate}
        onMenuToggle={() => setRightPanelOpen(!rightPanelOpen)}
        language={language}
        onLanguageChange={handleLanguageChange}
        onNavigate={navigate}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
      />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar — Chat List */}
        <div className={`w-64 flex-shrink-0 hidden md:flex flex-col panel-left`}>
          <ChatList
            onChatSelect={handleChatSelect}
            activeChatId={activeChatId}
            refreshKey={chatRefreshKey}
            onWizardOpen={handleOpenWizard}
          />
        </div>

        {/* Center — Chat Messages */}
        <ChatInterface
          language={language}
          chatId={activeChatId}
          onChatUpdated={handleChatUpdated}
          openWizard={openWizard}
        />

        {/* Right Sidebar — Standards / Auto-Fetch / Analytics */}
        <div className={`hidden lg:flex panel-right`}>
          <RightPanel
            standards={standards}
            health={health}
            isOpen={rightPanelOpen}
            onClose={() => setRightPanelOpen(false)}
            onWizardQuestion={(q) => {
              // Switch to a new chat and ask the wizard question
              handleOpenWizard()
            }}
          />
        </div>
      </div>
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white hide-mobile">
        {t('ministry', language)} | {t('poweredBy', language)}
      </footer>
    </div>
  )
}
