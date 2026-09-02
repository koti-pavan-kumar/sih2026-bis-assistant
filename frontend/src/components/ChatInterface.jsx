import React, { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import LoadingDots from './LoadingDots'
import VoiceInput from './VoiceInput'
import CertificationWizard from './CertificationWizard'
import { t } from '../utils/translations'

const REQUEST_TIMEOUT_MS = 45000

const STORAGE_KEY = 'manakmitra_chat_history'
const MAX_HISTORY_FOR_CONTEXT = 6  // Last 6 messages (3 turns) for LLM context

export default function ChatInterface({ language = 'en' }) {
  const [messages, setMessages] = useState(() => {
    // Load persisted chat history
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showWizard, setShowWizard] = useState(false)
  const messagesEnd = useRef(null)
  const timerRef = useRef(null)
  const abortControllerRef = useRef(null)

  // Persist messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
      } catch {}
    }
  }, [messages])

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
      // Build conversation history for multi-turn context
      const historyForContext = messages
        .slice(-MAX_HISTORY_FOR_CONTEXT)
        .map(m => ({ role: m.role, content: m.content }))

      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: queryToSend,
          response_language: language,
          conversation_history: historyForContext  // Multi-turn context
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
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Wizard toggle */}
      <div className="px-4 py-2 bg-white border-b flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowWizard(false)}
            className={`text-sm font-medium transition ${
              !showWizard ? 'text-navy border-b-2 border-navy' : 'text-gray-400 hover:text-gray-600'
            } pb-1`}
          >
            {t('chat', language)}
          </button>
          <button
            onClick={() => setShowWizard(true)}
            className={`text-sm font-medium transition ${
              showWizard ? 'text-navy border-b-2 border-navy' : 'text-gray-400 hover:text-gray-600'
            } pb-1`}
          >
            {t('certificationWizard', language)}
          </button>
        </div>
        {messages.length > 0 && !showWizard && (
          <button
            onClick={() => {
              setMessages([])
              localStorage.removeItem(STORAGE_KEY)
            }}
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
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-lg font-semibold text-gray-500">{t('bisAssistantTitle', language)}</h3>
                <p className="text-sm mt-2">{t('askAnyQuestion', language)}</p>
                <p className="text-xs mt-1 text-gray-400">{t('supportsLanguages', language)}</p>
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
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
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
        <div className="p-4 bg-white border-t">
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
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy disabled:bg-gray-100"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-saffron hover:bg-saffron-light text-white px-6 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
            >
              {t('askButton', language)}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
