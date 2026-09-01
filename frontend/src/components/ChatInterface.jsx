import React, { useState, useRef, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import LoadingDots from './LoadingDots'

export default function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEnd = useRef(null)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg })
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer,
        sources: data.sources,
        confidence: data.confidence,
        language: data.language,
        citations: data.citations
      }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, an error occurred. Please try again.',
        confidence: 'LOW'
      }])
    }
    setLoading(false)
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-20">
            <div className="text-5xl mb-4">🏛️</div>
            <h3 className="text-lg font-semibold text-gray-500">BIS Standards AI Assistant</h3>
            <p className="text-sm mt-2">Ask any question about Indian Standards in Hindi or English</p>
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble key={i} message={msg} />
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border">
              <LoadingDots />
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>
      <div className="p-4 bg-white border-t">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="प्रश्न पूछें / Ask a question about Indian Standards..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-saffron hover:bg-saffron-light text-white px-6 py-3 rounded-xl font-semibold text-sm transition disabled:opacity-50"
          >
            पूछें ↵
          </button>
        </div>
      </div>
    </div>
  )
}
