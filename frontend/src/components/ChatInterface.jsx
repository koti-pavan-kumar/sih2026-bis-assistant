import React, { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import LoadingDots from './LoadingDots'
import VoiceInput from './VoiceInput'
import CertificationWizard from './CertificationWizard'
import { t } from '../utils/translations'
import { loadChats, saveChats, getActiveChatId, setActiveChatId } from '../utils/chatStorage'

const REQUEST_TIMEOUT_MS = 45000
const MAX_HISTORY_FOR_CONTEXT = 6

/**
 * ChatInterface — Displays messages for a specific chat session.
 * Each user has their own independent chat storage.
 */
export default function ChatInterface({ language = 'en', chatId, onChatUpdated, openWizard }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showWizard, setShowWizard] = useState(false)
  const messagesEnd = useRef(null)
  const timerRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Load messages when chatId changes
  useEffect(() => {
    if (!chatId) { setMessages([]); return }
    const chats = loadChats()
    const chat = chats.find(c => c.id === chatId)
    setMessages(chat?.messages || [])
    setInput('')
    setLoading(false)
    setShowWizard(false)
  }, [chatId])

  // External wizard trigger
  useEffect(() => {
    if (openWizard) setShowWizard(true)
  }, [openWizard])

  // Save messages to the specific chat whenever they change
  useEffect(() => {
    if (!chatId || messages.length === 0) return
    const chats = loadChats()
    const idx = chats.findIndex(c => c.id === chatId)
    if (idx === -1) return

    chats[idx].messages = messages

    // Auto-title: use first user message as chat title (truncated)
    if (messages.length > 0 && chats[idx].title === 'New Chat') {
      const firstUserMsg = messages.find(m => m.role === 'user')
      if (firstUserMsg) {
        chats[idx].title = firstUserMsg.content.slice(0, 40) + (firstUserMsg.content.length > 40 ? '...' : '')
      }
    }

    saveChats(chats)
    onChatUpdated?.()
  }, [messages, chatId])

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  const startTimer = useCallback(() => {
    setElapsedTime(0)
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }, [])

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setElapsedTime(0)
  }, [])

  const handleSend = async (retryQuery = null) => {
    const queryToSend = retryQuery || input.trim()
    if (!queryToSend || loading) return

    if (retryQuery) {
      setMessages(prev => prev.slice(0, -1))
    }

    setInput('')
    if (!retryQuery) {
      setMessages(prev => [...prev, { role: 'user', content: queryToSend }])
    }
    setLoading(true)
    startTimer()

    abortControllerRef.current = new AbortController()
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const historyForContext = messages
        .slice(-MAX_HISTORY_FOR_CONTEXT)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryToSend,
          response_language: language,
          conversation_history: historyForContext
        }),
        signal: abortControllerRef.current.signal
      })

      clearTimeout(timeoutId)

      if (!res.ok) {
        let errorMsg = `Server error (${res.status})`
        try {
          const errorData = await res.json()
          errorMsg = errorData.detail || errorMsg
        } catch {
          errorMsg = `${res.status}: ${res.statusText || 'Unknown error'}`
        }
        throw new Error(errorMsg)
      }

      const data = await res.json()

      if (!data.answer) {
        throw new Error('Invalid response: missing answer field')
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources || [],
        confidence: data.confidence || 'UNKNOWN',
        language: data.language || 'en',
        citations: data.citations || []
      }])
    } catch (err) {
      clearTimeout(timeoutId)

      let errorMsg
      if (err.name === 'AbortError') {
        errorMsg = t('timedOut', language)
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorMsg = t('cannotConnect', language)
      } else if (err.message?.includes('Server error')) {
        errorMsg = `${t('backendError', language)} ${err.message}`
      } else {
        errorMsg = `Error: ${err.message || 'Unknown error occurred'}`
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errorMsg,
        confidence: 'LOW',
        isError: true,
        retryQuery: queryToSend
      }])
    } finally {
      stopTimer()
      setLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleRetry = (retryQuery) => {
    handleSend(retryQuery)
  }

  const handleWizardQuestion = (query) => {
    setShowWizard(false)
    setInput(query)
    setTimeout(() => {
      handleSend(query)
    }, 100)
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Wizard toggle */}
      <div className="px-4 py-2 bg-white dark:bg-[#14161c] border-b border-gray-300 dark:border-[#2a2d35] flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowWizard(false)}
            className={`text-sm font-medium transition ${
              !showWizard ? 'text-[#000080] dark:text-blue-300 border-b-2 border-[#000080] dark:border-blue-300' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            } pb-1`}
          >
            {t('chat', language)}
          </button>
          <button
            onClick={() => setShowWizard(true)}
            className={`text-sm font-medium transition ${
              showWizard ? 'text-[#FF9933] border-b-2 border-[#FF9933]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            } pb-1`}
          >
            {t('certificationWizard', language)}
          </button>
        </div>
        {messages.length > 0 && !showWizard && (
          <button
            onClick={() => setMessages([])}
            className="text-xs text-gray-400 hover:text-red-500 transition flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
            Clear chat
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {showWizard ? (
          <CertificationWizard onAskQuestion={handleWizardQuestion} language={language} />
        ) : (
          <>
            {messages.length === 0 && !showWizard && (
              <div className="mt-8 space-y-6">
                {/* Hero section */}
                <div className="text-center">
                  <div className="text-5xl mb-3">🏛️</div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-200">BIS Standards AI Assistant</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ask any question about Indian Standards in 20 languages</p>
                </div>

                {/* Two main options */}
                <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Free Chat */}
                  <div className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-2xl p-5 hover:shadow-md transition cursor-default">
                    <div className="text-3xl mb-3">💬</div>
                    <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1">Ask a Question</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Type or speak in any language about any BIS standard</p>
                    <div className="space-y-1.5">
                      {[
                        { q: 'What is min yield stress for Fe 500?', lang: 'EN' },
                        { q: 'सीमेंट में क्लोराइड की अधिकतम मात्रा?', lang: 'HI' },
                      ].map((item, i) => (
                        <div key={i} className="text-[11px] bg-gray-50 dark:bg-[#252830] text-gray-600 dark:text-gray-400 px-3 py-1.5 rounded-lg">
                          <span className="font-semibold text-[#000080] dark:text-blue-300">[{item.lang}]</span> {item.q}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certification Wizard */}
                  <div
                    onClick={() => setShowWizard(true)}
                    className="bg-gradient-to-br from-[#FF9933] to-[#E88A2D] dark:from-[#7c4a1e] dark:to-[#5a3615] text-white rounded-2xl p-5 hover:shadow-md transition cursor-pointer group"
                  >
                    <div className="text-3xl mb-3">📋</div>
                    <h4 className="font-bold mb-1">Certification Wizard</h4>
                    <p className="text-xs text-white/80 mb-3">Don't know which standard applies? Let us guide you step by step</p>
                    <div className="space-y-1.5">
                      {[
                        { cat: '🏗️ Cement & Concrete', count: '5 standards' },
                        { cat: '⚙️ Steel & Metals', count: '2 standards' },
                        { cat: '🥛 Food & Dairy', count: '2 standards' },
                      ].map((item, i) => (
                        <div key={i} className="text-[11px] bg-white/15 px-3 py-1.5 rounded-lg flex items-center justify-between">
                          <span>{item.cat}</span>
                          <span className="text-white/60 text-[10px]">{item.count}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-xs font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      Start Wizard →
                    </div>
                  </div>
                </div>

                {/* Quick tips */}
                <div className="max-w-2xl mx-auto text-center">
                  <div className="flex items-center justify-center gap-4 text-[10px] text-gray-400 dark:text-gray-500">
                    <span>🎤 Voice input</span>
                    <span>•</span>
                    <span>🌐 20 languages</span>
                    <span>•</span>
                    <span>📎 Source citations</span>
                    <span>•</span>
                    <span>🔗 Official BIS links</span>
                  </div>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                onRetry={msg.isError ? () => handleRetry(msg.retryQuery) : undefined}
                language={language}
              />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#1a1d23] rounded-2xl px-4 py-3 shadow-sm border border-gray-200 dark:border-[#2a2d35]">
                  <div className="flex items-center gap-2">
                    <LoadingDots />
                    <span className="text-xs text-gray-400 ml-2">
                      {elapsedTime}s{elapsedTime > 20 ? ` - ${t('stillWorking', language)}` : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </>
        )}
      </div>

      {/* Input bar */}
      {!showWizard && (
        <div className="p-4 bg-white dark:bg-[#14161c] border-t border-gray-300 dark:border-[#2a2d35]">
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <VoiceInput
              onResult={(text) => setInput(prev => prev ? `${prev} ${text}` : text)}
              disabled={loading}
            />
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
              placeholder={t('askPlaceholder', language)}
              className="flex-1 border border-gray-300 dark:border-[#3a3d45] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] dark:bg-[#1a1d23] dark:text-gray-200 disabled:bg-gray-100 dark:disabled:bg-[#252830]"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-[#FF9933] hover:bg-[#E88A2D] text-white px-6 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
            >
              {t('askButton', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
