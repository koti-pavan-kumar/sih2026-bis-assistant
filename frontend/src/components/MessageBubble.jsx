import React from 'react'

// Language display labels with flags
const LANGUAGE_LABELS = {
  en: '🇬🇧 English',
  hi: '🇮🇳 हिंदी',
  bn: '🇮🇳 বাংলা',
  ta: '🇮🇳 தமிழ்',
  te: '🇮🇳 తెలుగు',
  mr: '🇮🇳 मराठी',
  gu: '🇮🇳 ગુજરાતી',
  ur: '🇮🇳 اردو',
  kn: '🇮🇳 ಕನ್ನಡ',
  ml: '🇮🇳 മലയാളം',
  pa: '🇮🇳 ਪੰਜਾਬੀ',
  or: '🇮🇳 ଓଡ଼ିଆ',
  as: '🇮🇳 অসমীয়া',
  ne: '🇮🇳 नेपाली',
  sa: '🇮🇳 संस्कृतम्',
  ks: '🇮🇳 कॉशुर',
  bo: '🇮🇳 बड़ो',
  sd: '🇮🇳 سنڌي',
  doi: '🇮🇳 डोगरी',
  ki: '🇮🇳 कोंकणी',
  mai: '🇮🇳 मैथिली',
}

export default function MessageBubble({ message, onRetry }) {
  const isUser = message.role === 'user'
  const isError = message.isError

  const confidenceDisplay = {
    HIGH: { text: 'HIGH confidence', color: 'bg-green-100 text-green-700' },
    MEDIUM: { text: 'MEDIUM confidence', color: 'bg-yellow-100 text-yellow-700' },
    LOW: { text: 'LOW confidence', color: 'bg-red-100 text-red-700' },
    TEMPLATE: { text: '⚡ Template Mode', color: 'bg-purple-100 text-purple-700' },
    UNKNOWN: { text: 'UNKNOWN', color: 'bg-gray-100 text-gray-600' }
  }[message.confidence] || { text: message.confidence, color: 'bg-gray-100 text-gray-600' }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-3xl ${isUser ? 'order-2' : ''}`}>
        <div className={`rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-navy text-white'
            : isError
              ? 'bg-red-50 border border-red-200 text-red-800'
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

        {/* Confidence + Language badges */}
        {!isUser && !isError && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {/* Confidence badge */}
            {message.confidence && (
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${confidenceDisplay.color}`}>
                {confidenceDisplay.text}
              </span>
            )}
            {/* Language indicator */}
            {message.language && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                message.language === 'en'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {LANGUAGE_LABELS[message.language] || message.language}
              </span>
            )}
          </div>
        )}

        {/* Source cards */}
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

        {/* Retry button for errors */}
        {isError && onRetry && (
          <div className="mt-2">
            <button
              onClick={onRetry}
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition"
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
