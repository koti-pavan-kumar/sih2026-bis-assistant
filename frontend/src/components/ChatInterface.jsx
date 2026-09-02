import React, { useState, useRef, useEffect, useCallback } from 'react'
import MessageBubble from './MessageBubble'
import LoadingDots from './LoadingDots'
import VoiceInput from './VoiceInput'
import CertificationWizard from './CertificationWizard'

// Timeout for API requests (Ollama can take 30-60s for complex queries)
const REQUEST_TIMEOUT_MS = 45000

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [showWizard, setShowWizard] = useState(false)
  const messagesEnd = useRef(null)
  const timerRef = useRef(null)
  const abortControllerRef = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (abortControllerRef.current) abortControllerRef.current.abort()
    }
  }, [])

  // Start elapsed time counter
  const startTimer = useCallback(() => {
    setElapsedTime(0)
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1)
    }, 1000)
  }, [])

  // Stop timer
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

    // Remove the last error message if retrying
    if (retryQuery) {
      setMessages(prev => prev.slice(0, -1))
    }

    setInput('')
    if (!retryQuery) {
      setMessages(prev => [...prev, { role: 'user', content: queryToSend }])
    }
    setLoading(true)
    startTimer()

    // Create abort controller for timeout
    abortControllerRef.current = new AbortController()
    const timeoutId = setTimeout(() => {
      abortControllerRef.current?.abort()
    }, REQUEST_TIMEOUT_MS)

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSend }),
        signal: abortControllerRef.current.signal
      })

      clearTimeout(timeoutId)

      // Check for HTTP errors
      if (!res.ok) {
        let errorMsg = `Server error (${res.status})`
        try {
          const errorData = await res.json()
          errorMsg = errorData.detail || errorMsg
        } catch {
          // JSON parse failed, use status text
          errorMsg = `${res.status}: ${res.statusText || 'Unknown error'}`
        }
        throw new Error(errorMsg)
      }

      const data = await res.json()

      // Validate response structure
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

      // Determine specific error message
      let errorMsg
      if (err.name === 'AbortError') {
        errorMsg = `Request timed out after ${REQUEST_TIMEOUT_MS / 1000}s. The AI model may be slow or unavailable. Please try again.`
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        errorMsg = 'Cannot connect to the backend server. Make sure the backend is running (python main.py).'
      } else if (err.message?.includes('Server error')) {
        errorMsg = `Backend error: ${err.message}`
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

  // Handle wizard question submission
  const handleWizardQuestion = (query) => {
    setShowWizard(false)
    setInput(query)
    // Auto-send the question
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
            💬 Chat
          </button>
          <button
            onClick={() => setShowWizard(true)}
            className={`text-sm font-medium transition ${
              showWizard ? 'text-navy border-b-2 border-navy' : 'text-gray-400 hover:text-gray-600'
            } pb-1`}
          >
            🧭 Certification Wizard
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {showWizard ? (
          <CertificationWizard onAskQuestion={handleWizardQuestion} />
        ) : (
          <>
            {messages.length === 0 && (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-5xl mb-4">🏛️</div>
                <h3 className="text-lg font-semibold text-gray-500">BIS Standards AI Assistant</h3>
                <p className="text-sm mt-2">Ask any question about Indian Standards in Hindi or English</p>
                <p className="text-xs mt-1 text-gray-400">Supports 18 Indian languages with voice input</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                message={msg}
                onRetry={msg.isError ? () => handleRetry(msg.retryQuery) : undefined}
              />
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
                  <div className="flex items-center gap-2">
                    <LoadingDots />
                    <span className="text-xs text-gray-400 ml-2">
                      {elapsedTime}s{elapsedTime > 20 ? ' - Still working...' : ''}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </>
        )}
      </div>

      {/* Input bar (only show in chat mode) */}
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
              placeholder="प्रश्न पूछें / Ask a question about Indian Standards..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy disabled:bg-gray-100"
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="bg-saffron hover:bg-saffron-light text-white px-6 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
            >
              पूछें ↵
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
