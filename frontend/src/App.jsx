import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'

export default function App() {
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    // Also refresh standards when health updates
    if (healthData) {
      fetch('/api/standards')
        .then(r => r.json())
        .then(d => setStandards(d.standards || []))
        .catch(() => {})
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header
        health={health}
        onHealthUpdate={handleHealthUpdate}
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          standards={standards}
          health={health}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <ChatInterface />
      </div>
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white hide-mobile">
        Ministry of Consumer Affairs &nbsp;|&nbsp; Supports 18 Indian Languages — Powered by RAG + LLM
      </footer>
    </div>
  )
}
