import React from 'react'
import { getBISDocumentURL, getGoogleSearchURL } from '../utils/urls'

const LANGUAGE_LABELS = {
  en: '🇬🇧 English', hi: '🇮🇳 हिंदी', bn: '🇮🇳 বাংলা', ta: '🇮🇳 தமிழ்',
  te: '🇮🇳 తెలుగు', mr: '🇮🇳 मराठी', gu: '🇮🇳 ગુજરાતી', ur: '🇮🇳 اردو',
  kn: '🇮🇳 ಕನ್ನಡ', ml: '🇮🇳 മലയാളം', pa: '🇮🇳 ਪੰਜਾਬੀ', or: '🇮🇳 ଓଡ଼ିଆ',
  as: '🇮🇳 অসমীয়া', ne: '🇮🇳 नेपाली', sa: '🇮🇳 संस्कृतम्',
}

// Section configs — icons, colors, labels (6 sections)
const SECTION_CONFIG = {
  '1': { icon: '📋', label: 'Applicable IS Standards', color: 'blue', bgClass: 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
  '2': { icon: '🔬', label: 'Testing Requirements', color: 'purple', bgClass: 'bg-purple-50 dark:bg-purple-900/15 border-purple-200 dark:border-purple-800', iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' },
  '3': { icon: '📍', label: 'Where to Test', color: 'green', bgClass: 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800', iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' },
  '4': { icon: '⚖️', label: 'Mandatory or Voluntary?', color: 'amber', bgClass: 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300' },
  '5': { icon: '🧪', label: 'Quality Control & Testing', color: 'teal', bgClass: 'bg-teal-50 dark:bg-teal-900/15 border-teal-200 dark:border-teal-800', iconBg: 'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-300' },
  '6': { icon: '📄', label: 'Documents Required', color: 'rose', bgClass: 'bg-rose-50 dark:bg-rose-900/15 border-rose-200 dark:border-rose-800', iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300' },
}

/**
 * Parse the 6-section structured response from the AI.
 * Looks for ### N. Section Title patterns.
 */
function parseStructuredResponse(text) {
  if (!text) return { intro: '', sections: [] }

  // Remove ### heading markers
  let cleaned = text
    .replace(/\$\\pm\s*(\d+)(?:\\\.(\d+))?\$?/g, '±$1.$2')
    .replace(/\$\\text\{([^}]+)\}\$/g, '$1')
    .replace(/\$\\cdot\$/g, '·')
    .replace(/\$([^$]+)\$/g, '$1')
    .replace(/\\\\%/g, '%')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const lines = cleaned.split('\n')
  const sections = []
  let currentSection = null
  let intro = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Detect section headers in multiple formats the AI might output:
    // "### 1. Title", "**1. Title**", "1. Title", "Section 1: Title"
    const sectionMatch = 
      line.match(/#{0,3}\s*\*{0,2}\s*(\d)\.\s*(.+?)\s*\*{0,2}\s*$/)
      || line.match(/Section\s+(\d)\s*[:\-–]\s*(.+)/i)
      || line.match(/^(\d)\s*[:\-–]\s+(.+)/)

    if (sectionMatch) {
      currentSection = {
        num: sectionMatch[1],
        title: sectionMatch[2].replace(/\*+/g, '').trim(),
        items: []
      }
      sections.push(currentSection)
      continue
    }

    // Detect section headers by title keywords (even without number prefix)
    const titleKeywords = [
      'applicable is standard', 'testing requirement', 'where to test',
      'mandatory', 'voluntary', 'certification process', 'documents required',
      'documents and information', 'document'
    ]
    const isTitleLine = titleKeywords.some(kw => line.toLowerCase().includes(kw))
      && line.length < 80  // Headers are short
      && (line.includes(':') || line.startsWith('#') || line.startsWith('**') || /^\d/.test(line))

    if (isTitleLine && !currentSection) {
      const matched = titleKeywords.find(kw => line.toLowerCase().includes(kw))
      const num = Object.keys(SECTION_CONFIG).find(k => SECTION_CONFIG[k].label.toLowerCase().includes(matched)) || String(sections.length + 1)
      currentSection = { num, title: line.replace(/\*+/g, '').replace(/^#{0,3}\s*/, '').trim(), items: [] }
      sections.push(currentSection)
      continue
    }

    if (currentSection) {
      currentSection.items.push(line)
    } else {
      intro += (intro ? '\n' : '') + line
    }
  }

  // Remove sections with no content — merge into intro
  const validSections = []
  for (const s of sections) {
    if (s.items.length === 0) {
      intro += (intro ? '\n' : '') + s.title
    } else {
      // Filter out empty or separator-only items
      s.items = s.items.filter(item => item.trim() && !/^[-=]{3,}$/.test(item.trim()))
      if (s.items.length > 0) {
        validSections.push(s)
      }
    }
  }

  return { intro, sections: validSections }
}

/**
 * Render a line with bold text, bullet points, and IS standard highlighting
 */
function RenderLine({ line }) {
  // Strip single asterisks used for emphasis (Gemini output)
  // e.g. *text* → text, **text** → text (bold rendered below)
  let cleaned = line
    .replace(/\*\*([^*]+)\*\*/g, '$1')  // Remove **bold** markers (we render bold via CSS)
    .replace(/\*([^*]+)\*/g, '$1')        // Remove *italic* markers

  // Handle bold **text** for rendering
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g)

  return (
    <span>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
        }

        // Highlight IS standard numbers
        const isParts = part.split(/(IS\s+\d{4}(?::\d{4})?)/g)
        return isParts.map((ip, j) => {
          if (/^IS\s+\d{4}/.test(ip)) {
            return <span key={`${i}-${j}`} className="font-mono font-bold text-[#1a2744] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">{ip}</span>
          }
          return <span key={`${i}-${j}`}>{ip}</span>
        })
      })}
    </span>
  )
}

export default function MessageBubble({ message, onRetry }) {
  const isUser = message.role === 'user'
  const isError = message.isError
  const parsed = !isUser && !isError ? parseStructuredResponse(message.content) : null

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-4xl ${isUser ? 'order-2' : ''}`}>
        <div className={`rounded-2xl px-5 py-4 shadow-sm ${
          isUser
            ? 'bg-[#1a2744] dark:bg-[#1e3a5f] text-white'
            : isError
              ? 'bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
              : 'bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] text-gray-800 dark:text-gray-200'
        }`}>
          {isUser ? (
            <p className="text-sm">{message.content}</p>
          ) : parsed ? (
            <div className="space-y-4">
              {/* Intro text */}
              {parsed.intro && (
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{parsed.intro}</p>
              )}

              {/* 6-Section Cards */}
              {parsed.sections.map((section, i) => {
                const config = SECTION_CONFIG[section.num] || {
                  icon: '📌', label: section.title,
                  bgClass: 'bg-gray-50 dark:bg-gray-900/15 border-gray-200 dark:border-gray-800',
                  iconBg: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-300'
                }

                return (
                  <div key={i} className={`rounded-xl border p-4 ${config.bgClass}`}>
                    {/* Section Header */}
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${config.iconBg}`}>
                        {config.icon}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section {section.num}</span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                          {config.label || section.title}
                        </h3>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className="space-y-1.5 ml-[42px]">
                      {section.items.map((item, j) => {
                        const isBullet = /^\s*[•\-*]\s/.test(item)
                        const isSubItem = /^\s{2,}[•\-*]\s/.test(item)
                        const hasLink = /https?:\/\//.test(item)

                        return (
                          <div key={j} className={`text-xs leading-relaxed ${
                            isBullet ? 'flex items-start gap-1.5' : ''
                          } ${isSubItem ? 'ml-4' : ''}`}>
                            {isBullet && (
                              <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                            )}
                            <span className="text-gray-700 dark:text-gray-300">
                              <RenderLine line={isBullet ? item.replace(/^\s*[•\-*]\s*/, '') : item} />
                            </span>
                            {/* Render links */}
                            {hasLink && item.match(/(https?:\/\/[^\s)]+)/g)?.map((url, k) => (
                              <a
                                key={k}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-1 text-[10px] text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                              >
                                🔗 Official Link
                              </a>
                            ))}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
          )}
        </div>

        {/* Language badge */}
        {!isUser && !isError && (
          <div className="mt-2 flex items-center gap-2 flex-wrap">
            {message.language && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                message.language === 'en' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}>
                {LANGUAGE_LABELS[message.language] || message.language}
              </span>
            )}
          </div>
        )}

        {/* Source cards */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
              <span>📄</span> Official Sources
            </div>
            {message.sources.map((s, i) => {
              const bisUrl = getBISDocumentURL(s.is_number, s.title)
              const googleUrl = getGoogleSearchURL(s.is_number, s.title)
              const href = bisUrl || googleUrl
              return (
                <a
                  key={i}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block source-card px-3 py-2 text-xs transition group"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-[#1a2744] dark:text-blue-300 group-hover:text-blue-600 dark:group-hover:text-blue-200">
                      <span className="inline-flex items-center gap-1">
                        {s.is_number}
                        <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </span>
                    </div>
                    <div className="text-gray-400 text-[10px]">{Math.round(s.score * 100)}% match</div>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 truncate mt-0.5">{s.title}</div>
                  <span className="text-[10px] text-[#1a2744] dark:text-blue-300 font-medium opacity-0 group-hover:opacity-100 transition">
                    View Official Document →
                  </span>
                </a>
              )
            })}
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
