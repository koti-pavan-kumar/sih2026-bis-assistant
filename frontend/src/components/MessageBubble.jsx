import React from 'react'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  const confidenceColor = {
    HIGH: 'bg-green-100 text-green-700',
    MEDIUM: 'bg-yellow-100 text-yellow-700',
    LOW: 'bg-red-100 text-red-700',
    COMPLETE: 'bg-green-100 text-green-700'
  }[message.confidence] || 'bg-gray-100 text-gray-600'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'order-2' : ''}`}>
        <div className={`rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-navy text-white'
            : 'bg-white border text-gray-800'
        }`}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="prose prose-sm max-w-none">
              {message.content.split('\n').map((line, i) => {
                if (line.startsWith('**') && line.endsWith('**')) {
                  return <h4 key={i} className="font-bold text-navy mt-3 mb-1">{line.replace(/\*\*/g, '')}</h4>
                }
                if (line.startsWith('•') || line.startsWith('-')) {
                  return <p key={i} className="ml-3 my-0.5">{line}</p>
                }
                return <p key={i} className="my-1">{line}</p>
              })}
            </div>
          )}
        </div>

        {!isUser && message.sources && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${confidenceColor}`}>
              {message.confidence} confidence
            </span>
            <span className="text-xs text-gray-400">🇬🇧 English</span>
          </div>
        )}

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-2 space-y-1">
            <div className="text-xs text-gray-400 font-medium">📄 Sources:</div>
            {message.sources.map((s, i) => (
              <div key={i} className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 text-xs">
                <div className="font-semibold text-navy">{s.is_number}</div>
                <div className="text-gray-600 truncate">{s.title}</div>
                {s.section && <div className="text-gray-400">Section {s.section}</div>}
                <div className="text-gray-400">Page {s.page} • {Math.round(s.score * 100)}% match</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
