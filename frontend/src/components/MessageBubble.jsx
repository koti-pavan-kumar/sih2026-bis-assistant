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

/**
 * Clean up raw markdown/Gemini output for professional display:
 * - Remove ### headings (we render our own)
 * - Clean LaTeX symbols ($\pm$ → ±, $\text{mm}$ → mm)
 * - Convert **bold** to styled spans
 * - Clean up bullet points
 */
function cleanText(text) {
  if (!text) return ''
  
  let cleaned = text
    // Remove ### heading markers
    .replace(/^#{1,6}\s+/gm, '')
    // Clean LaTeX symbols
    .replace(/\$\\pm\s*(\d+)(?:\\.(\d+))?\\%?\$/g, '±$1.$2%')
    .replace(/\$\\pm\s*(\d+)\\%?\$/g, '±$1%')
    .replace(/\$\\text\{([^}]+)\}\$/g, '$1')
    .replace(/\$\\cdot\$/g, '·')
    .replace(/\$([^$]+)\$/g, '$1')
    // Clean escaped percentages
    .replace(/\\%/g, '%')
    // Clean up extra whitespace
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  return cleaned
}

/**
 * Parse response into structured sections for professional display.
 * Gemini typically returns: **Direct Answer**, **Supporting Details**, **Citations**
 */
function parseSections(text) {
  if (!text) return { intro: '', sections: [], citations: [] }
  
  const cleaned = cleanText(text)
  const lines = cleaned.split('\n')
  
  const sections = []
  const citations = []
  let currentSection = null
  let intro = ''
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    // Detect section headers (bold text or known patterns)
    const isHeader = 
      (line.startsWith('**') && line.includes('**')) ||
      /^(Direct Answer|Supporting Details|Citations|Scope|Grade|Chemical|Mechanical|Test Methods|Marking|Tolerances)/i.test(line)
    
    const isCitationSection = /^(Citations|References|Sources)/i.test(line.replace(/\*\*/g, ''))
    
    if (isCitationSection) {
      currentSection = { type: 'citations', title: 'Citations', items: [] }
      sections.push(currentSection)
      continue
    }
    
    if (isHeader) {
      const title = line.replace(/\*\*/g, '').replace(/^#+\s*/, '').trim()
      currentSection = { type: 'content', title, items: [] }
      sections.push(currentSection)
      continue
    }
    
    if (currentSection) {
      currentSection.items.push(line)
    } else {
      // Content before any section header
      intro += (intro ? '\n' : '') + line
    }
  }
  
  return { intro, sections, citations: sections.find(s => s.type === 'citations')?.items || [] }
}

/**
 * Render a single line with bold text support
 */
function RenderLine({ line, isFirst }) {
  // Split by **bold** markers
  const parts = line.split(/(\*\*[^*]+\*\*)/g)
  
  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          const boldText = part.slice(2, -2)
          return (
            <strong key={i} className="font-semibold text-navy">{boldText}</strong>
          )
        }
        // Handle bullet points
        if (part.startsWith('•') || part.startsWith('-') || part.startsWith('*')) {
          return <span key={i}>{part}</span>
        }
        return <span key={i}>{part}</span>
      })}
    </span>
  )
}

export default function MessageBubble({ message, onRetry }) {
  const isUser = message.role === 'user'
  const isError = message.isError

  const confidenceDisplay = {
    HIGH: { text: 'HIGH confidence', color: 'bg-green-100 text-green-700', icon: '✓' },
    MEDIUM: { text: 'MEDIUM confidence', color: 'bg-yellow-100 text-yellow-700', icon: '~' },
    LOW: { text: 'LOW confidence', color: 'bg-red-100 text-red-700', icon: '!' },
    TEMPLATE: { text: '⚡ Template Mode', color: 'bg-purple-100 text-purple-700', icon: '⚡' },
    UNKNOWN: { text: 'UNKNOWN', color: 'bg-gray-100 text-gray-600', icon: '?' }
  }[message.confidence] || { text: message.confidence, color: 'bg-gray-100 text-gray-600', icon: '?' }

  // Parse the response into structured sections
  const parsed = !isUser && !isError ? parseSections(message.content) : null

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
            <p className="text-sm">{message.content}</p>
          ) : parsed ? (
            <div className="space-y-4">
              {/* Intro text (before sections) */}
              {parsed.intro && (
                <p className="text-sm text-gray-700 leading-relaxed">{parsed.intro}</p>
              )}
              
              {/* Structured sections */}
              {parsed.sections.map((section, i) => (
                <div key={i}>
                  {section.type === 'citations' ? (
                    // Citations section - styled differently
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">
                        📚 Citations
                      </h4>
                      <div className="space-y-1">
                        {section.items.map((item, j) => (
                          <div key={j} className="flex items-start gap-2 text-xs">
                            <span className="text-navy font-mono">•</span>
                            <span className="text-gray-600">
                              <RenderLine line={item} />
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    // Content section
                    <div>
                      <h4 className="text-sm font-bold text-navy mb-2 flex items-center gap-2">
                        {section.title.includes('Direct Answer') && <span className="text-green-600">✓</span>}
                        {section.title.includes('Supporting') && <span className="text-blue-500">📋</span>}
                        {section.title}
                      </h4>
                      <div className="space-y-1.5">
                        {section.items.map((item, j) => {
                          const isBullet = /^\s*[•\-*]\s/.test(item)
                          const isSubItem = /^\s{2,}[•\-*]\s/.test(item)
                          
                          return (
                            <div key={j} className={`text-sm leading-relaxed ${
                              isBullet ? 'flex items-start gap-2 ml-1' : ''
                            } ${isSubItem ? 'ml-6' : ''}`}>
                              {isBullet && (
                                <span className="text-saffron font-bold mt-0.5 flex-shrink-0">•</span>
                              )}
                              <span className={isBullet ? '' : 'text-gray-700'}>
                                <RenderLine line={isBullet ? item.replace(/^\s*[•\-*]\s*/, '') : item} />
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            // Error or simple text
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {/* Confidence + Language badges */}
        {!isUser && !isError && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${confidenceDisplay.color}`}>
              {confidenceDisplay.icon} {confidenceDisplay.text}
            </span>
            {message.language && (
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
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
          <div className="mt-3 space-y-1.5">
            <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
              <span>📄</span> Sources
            </div>
            {message.sources.map((s, i) => (
              <div key={i} className="bg-blue-50/80 border border-blue-100 rounded-xl px-3 py-2.5 text-xs hover:bg-blue-50 transition">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-navy">{s.is_number}</div>
                  <div className="text-gray-400 text-[10px]">{Math.round(s.score * 100)}% match</div>
                </div>
                <div className="text-gray-600 truncate mt-0.5">{s.title}</div>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                  {s.section && <span>📋 {s.section}</span>}
                  <span>📄 Page {s.page}</span>
                </div>
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
