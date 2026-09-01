import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ChatInterface from './components/ChatInterface'

export default function App() {
  const [standards, setStandards] = useState([])
  const [health, setHealth] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(setHealth)
      .catch(() => {})

    fetch('/api/standards')
      .then(r => r.json())
      .then(d => setStandards(d.standards || []))
      .catch(() => {})
  }, [])

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header health={health} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar standards={standards} />
        <ChatInterface />
      </div>
      <footer className="text-center py-2 text-xs text-gray-400 border-t bg-white">
        Ministry of Consumer Affairs &nbsp;|&nbsp; Supports Hindi (हिंदी) and English — Powered by RAG + LLM
      </footer>
    </div>
  )
}
