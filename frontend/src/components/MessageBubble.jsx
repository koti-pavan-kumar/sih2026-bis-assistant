import React from 'react'
import { getBISDocumentURL } from '../utils/urls'

const LANGUAGE_LABELS = {
  en: '🇬🇧 English', hi: '🇮🇳 हिंदी', bn: '🇮🇳 বাংলা', ta: '🇮🇳 தமிழ்',
  te: '🇮🇳 తెలుగు', mr: '🇮🇳 मराठी', gu: '🇮🇳 ગુજરાતી', ur: '🇮🇳 اردو',
  kn: '🇮🇳 ಕನ್ನಡ', ml: '🇮🇳 മലയാളം', pa: '🇮🇳 ਪੰਜਾਬੀ', or: '🇮🇳 ଓଡ଼ିଆ',
  as: '🇮🇳 অসমীয়া', ne: '🇮🇳 नेपाली', sa: '🇮🇳 संस्कृतम्',
}

// Section configs — icons, colors, labels (6 sections)
const SECTION_CONFIG = {
  '1': { icon: '📋', label: 'Applicable IS Standards', color: 'blue', bgClass: 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800', iconBg: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' },
  '2': { icon: '🔬', label: 'Technical Requirements', color: 'purple', bgClass: 'bg-purple-50 dark:bg-purple-900/15 border-purple-200 dark:border-purple-800', iconBg: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300' },
  '3': { icon: '📍', label: 'Where to Test', color: 'green', bgClass: 'bg-green-50 dark:bg-green-900/15 border-green-200 dark:border-green-800', iconBg: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300' },
  '4': { icon: '⚖️', label: 'Mandatory or Voluntary?', color: 'amber', bgClass: 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-800', iconBg: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300' },
  '5': { icon: '📝', label: 'Certification Process & Quality Control', color: 'indigo', bgClass: 'bg-indigo-50 dark:bg-indigo-900/15 border-indigo-200 dark:border-indigo-800', iconBg: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300' },
  '6': { icon: '📄', label: 'Documents Required', color: 'rose', bgClass: 'bg-rose-50 dark:bg-rose-900/15 border-rose-200 dark:border-rose-800', iconBg: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300' },
}

// Title-keyword → section number (label text may change; this mapping must not)
const KEYWORD_SECTION_NUM = {
  'applicable is standard': '1', 'testing requirement': '2', 'technical requirement': '2',
  'where to test': '3', 'mandatory': '4', 'voluntary': '4', 'certification process': '5',
  'documents required': '6', 'documents and information': '6', 'document': '6',
}

/**
 * Group Section-1 lines into per-standard entries for block rendering.
 * Handles the new block format (**IS X — Title**, description,
 * **Why this standard applies:** …) and legacy one-line bullets
 * ("IS 455:2015 — Title — reason").
 * Returns { entries: [{ is, title, content, why }], prelude: [lines before first IS] }.
 */
function parseStandardEntries(items) {
  const entries = []
  const prelude = []
  let current = null
  let whyMode = false

  const stripBold = (s) => s.replace(/^\*+/, '').replace(/\*+$/, '').trim()
  const whyText = (w) => {
    // Only strip an explicit "Why ...:" label — never a mid-text colon
    // (e.g. inside "[IS 14543:2018, Section 3]").
    if (/^why\b[^:]*:/i.test(w)) return w.replace(/^[^:]*:/, '').trim()
    return w.trim()
  }

  for (const raw of items) {
    const line = raw.replace(/^\s*[•\-*]\s+/, '').trim()
    if (!line) continue
    const bare = stripBold(line)

    // New standard entry — line starts with an IS number
    if (/^IS\s*\d/i.test(bare)) {
      const parts = bare.split(/\s+[—–]\s+/)
      current = { is: stripBold(parts[0]), title: '', content: [], why: '' }
      entries.push(current)
      whyMode = false

      const rest = parts.slice(1).map(stripBold).filter(Boolean)
      if (rest.length > 0) {
        let whyIdx = rest.findIndex(s => /^why\b/i.test(s) || /^this standard applies\b/i.test(s))
        if (whyIdx < 0 && rest.length >= 2 && /^(why|this standard|it applies|it is|because)/i.test(rest[rest.length - 1])) {
          whyIdx = rest.length - 1
        }
        const contentSegs = rest.filter((_, idx) => idx !== whyIdx)
        if (whyIdx >= 0) current.why = whyText(rest[whyIdx])

        if (contentSegs.length >= 2) {
          current.title = contentSegs[0]
          current.content.push(...contentSegs.slice(1))
        } else if (contentSegs.length === 1) {
          const t = contentSegs[0]
          if (t.length <= 110 && !/[.!?,;]$/.test(t)) current.title = t
          else current.content.push(t)
        }
      }
      continue
    }

    // "Why this standard applies: …" on its own line
    if (current && /^why\s+(?:this\s+standard\s+)?(?:it\s+)?applies/i.test(bare)) {
      const colon = bare.indexOf(':')
      const after = colon >= 0 ? stripBold(bare.slice(colon + 1)) : ''
      if (after) {
        current.why = after
        whyMode = false
      } else {
        whyMode = true // reason continues on following lines
      }
      continue
    }

    if (!current) { prelude.push(bare); continue }
    if (whyMode) current.why = current.why ? `${current.why} ${stripBold(line)}` : stripBold(line)
    else current.content.push(bare)
  }

  // If no title was parsed, promote a title-looking first content line.
  for (const e of entries) {
    if (!e.title && e.content.length > 0) {
      const first = e.content[0].trim()
      if (first.length <= 110 && !/[.!?]$/.test(first) && !/^[-•*]/.test(first) && !/^why\b/i.test(first)) {
        e.title = first
        e.content.shift()
      }
    }
  }

  return { entries, prelude }
}

/**
 * Detect a sub-group heading inside a section (e.g. Section 2's test categories).
 * Accepted styles: "## Name", "**Name**", and (Section 2 only) "2. Name".
 */
function subgroupTitle(line, sectionNum) {
  if (sectionNum === '1') return null
  let m
  if ((m = line.match(/^#{1,4}\s+(.+)$/))) return stripMarkers(m[1])
  if ((m = line.match(/^\*\*([^*]+)\*\*:?\s*$/))) return stripMarkers(m[1])
  if (sectionNum === '2' && (m = line.match(/^(?:#{0,3}\s*)?\d{1,2}[.)]\s+(.+)$/))) return stripMarkers(m[1])
  return null
}

function stripMarkers(s) {
  return s.replace(/\*+/g, '').replace(/\s*[:：]\s*$/, '').trim()
}

/**
 * Parse the 6-section structured response from the AI.
 * Looks for ### N. Section Title patterns.
 */
function parseStructuredResponse(text) {
  if (!text) return { heading: '', intro: '', sections: [] }

  // Raw fallback from the backend when the LLM is down — never try to parse
  // section headers out of raw context; render it as plain text instead.
  if (/^\s*(Based on the available BIS standard excerpts|The AI service is briefly unavailable)/.test(text)) {
    return { heading: '', intro: '', sections: [], plain: true }
  }

  // Dynamic title heading: a single '#' / '##' line (### is reserved for
  // section headers) naming the product/standard this answer is about.
  let heading = ''
  text = text.replace(/^[ \t]*#{1,2}(?!#)[ \t]*(.+?)[ \t]*$/m, (_, h) => {
    heading = h.replace(/[#+]/g, '').trim()
    return ''
  })

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
    // Anchored at line start and restricted to 1–6: a loose pattern turns
    // fragments like "...minimum 50.0% ..." into bogus "SECTION 0" cards.
    // "### 5. Title", "**5. Title**", bare "5. Title", "Section 5: Title".
    // The bare "N." form is ambiguous: numbered LIST items
    // ("1. Submit an online application through the portal at https://….")
    // also match it. Only accept a bare number when the line is written as a
    // title — no # / ** marker, short, and not ending in a sentence stop.
    let secNum = null
    let secTitle = ''
    const numbered = line.match(/^(#{0,3})\s*\*{0,2}\s*([1-6])\.\s+(.+?)\s*\*{0,2}$/)
    if (numbered) {
      const marked = numbered[1].length > 0 || /^\*{1,2}\s*[1-6]\./.test(line)
      const listItem = !marked && (line.length > 80 || /[.!?]$/.test(line))
      // Unmarked numbers never go backwards: inside Section 5, a bare
      // "1. …" line is a list item, not a return to Section 1.
      const backwards = !marked && currentSection && Number(numbered[2]) <= Number(currentSection.num)
      if (!listItem && !backwards) {
        secNum = numbered[2]
        secTitle = numbered[3]
      }
    } else {
      const worded = line.match(/^Section\s+([1-6])\s*[:\-–]\s*(.+)/i)
        || line.match(/^([1-6])\s*[:\-–]\s+(.+)/)
      if (worded) {
        secNum = worded[1]
        secTitle = worded[2]
      }
    }

    if (secNum) {
      // A repeated header with the SAME number as the open section is really a
      // sub-heading inside it (e.g. "2. Microbiological Safety" under Section 2)
      // — keep it as an item instead of letting duplicate-merge swallow it.
      if (currentSection && secNum === currentSection.num) {
        currentSection.items.push(line)
        continue
      }
      currentSection = {
        num: secNum,
        title: secTitle.replace(/\*+/g, '').trim(),
        items: []
      }
      sections.push(currentSection)
      continue
    }

    // Detect section headers by title keywords (even without number prefix)
    const titleKeywords = [
      'applicable is standard', 'testing requirement', 'technical requirement', 'where to test',
      'mandatory', 'voluntary', 'certification process', 'documents required',
      'documents and information', 'document'
    ]
    const isTitleLine = titleKeywords.some(kw => line.toLowerCase().includes(kw))
      && line.length < 80  // Headers are short
      // Require an actual header signal — not just a colon (a colon-only rule
      // misfires on context lines like "Marking Requirements:")
      && (line.startsWith('#') || line.startsWith('**') || /^section\s*\d/i.test(line) || /^\d+[.)]?\s/.test(line))

    if (isTitleLine && !currentSection) {
      const matched = titleKeywords.find(kw => line.toLowerCase().includes(kw))
      const num = KEYWORD_SECTION_NUM[matched] || String(sections.length + 1)
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
  // Also deduplicate: keep only the FIRST instance of each section number
  const validSections = []
  const seenNumbers = new Set()
  for (const s of sections) {
    if (s.items.length === 0) {
      intro += (intro ? '\n' : '') + s.title
    } else if (seenNumbers.has(s.num)) {
      // Duplicate section — merge content into the first instance
      const existing = validSections.find(vs => vs.num === s.num)
      if (existing) {
        existing.items.push(...s.items)
      }
    } else {
      // Filter out empty or separator-only items
      s.items = s.items.filter(item => item.trim() && !/^[-=]{3,}$/.test(item.trim()))
      if (s.items.length > 0) {
        seenNumbers.add(s.num)
        validSections.push(s)
      }
    }
  }

  return { heading, intro, sections: validSections }
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
        const isParts = part.split(/(IS\s+\d{3,5}(?::\d{4})?)/g)
        return isParts.map((ip, j) => {
          if (/^IS\s+\d{3,5}/.test(ip)) {
            return <span key={`${i}-${j}`} className="font-mono font-bold text-[#1a2744] dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 px-1 rounded">{ip}</span>
          }
          return <span key={`${i}-${j}`}>{ip}</span>
        })
      })}
    </span>
  )
}

/**
 * One standard in Section 1: big IS heading, content, "Why this standard
 * applies" box, and a button straight to the official government document.
 */
function StandardEntry({ entry }) {
  const url = getBISDocumentURL(entry.is, entry.title)

  return (
    <div className="py-3 first:pt-0 border-t border-blue-100/80 dark:border-blue-900/40 first:border-t-0">
      {/* Big IS heading */}
      <h4 className="flex items-baseline flex-wrap gap-x-2 leading-snug">
        <span className="text-[17px] sm:text-[19px] font-extrabold text-[#16337a] dark:text-blue-200">
          {entry.is}
        </span>
        {entry.title && (
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300">— {entry.title}</span>
        )}
      </h4>

      {/* Content below the heading */}
      {entry.content.length > 0 && (
        <div className="mt-2 space-y-1.5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
          {entry.content.map((c, i) => {
            const isBullet = /^[-•*]\s/.test(c)
            return isBullet ? (
              <div key={i} className="flex items-start gap-1.5">
                <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                <span><RenderLine line={c.replace(/^[-•*]\s+/, '')} /></span>
              </div>
            ) : (
              <p key={i}><RenderLine line={c} /></p>
            )
          })}
        </div>
      )}

      {/* Why this standard applies */}
      {entry.why && (
        <div className="mt-2 rounded-md border border-blue-200 dark:border-blue-800 bg-white/70 dark:bg-blue-950/30 px-3 py-2">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 mb-1">
            Why this standard applies
          </div>
          <p className="text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
            <RenderLine line={entry.why} />
          </p>
        </div>
      )}

      {/* Official source button */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#1a2744] hover:bg-[#2a3f6b] dark:bg-blue-700 dark:hover:bg-blue-600 text-white text-[13px] font-semibold px-4 py-2 transition"
        >
          📄 View Original Source
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 3h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
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
            <p className="text-[15px] leading-relaxed">{message.content}</p>
          ) : parsed && !parsed.plain ? (
            <div className="space-y-3">
              {/* Dynamic answer heading — title of the product/standard asked */}
              {parsed.heading && (
                <div className="rounded-lg bg-[#eaf1fb] dark:bg-[#1e2a44] border border-[#c9dcf5] dark:border-[#2e4a7f] px-4 py-2.5">
                  <h2 className="text-base sm:text-lg font-extrabold leading-snug text-[#16337a] dark:text-blue-200">
                    {parsed.heading}
                  </h2>
                </div>
              )}

              {/* Intro text */}
              {parsed.intro && (
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">{parsed.intro}</p>
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
                        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Section {section.num}</span>
                        <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-tight">
                          {config.label || section.title}
                        </h3>
                      </div>
                    </div>

                    {/* Section Content */}
                    <div className={`space-y-2 ${section.num === '1' ? '' : 'ml-[42px]'}`}>
                      {(() => {
                        // Section 1: each standard as its own block — big heading,
                        // content, "Why this standard applies", official-source button.
                        if (section.num === '1') {
                          const { entries, prelude } = parseStandardEntries(section.items)
                          if (entries.length > 0) {
                            return (
                              <>
                                {prelude.map((p, k) => (
                                  <p key={`pre-${k}`} className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                                    <RenderLine line={p} />
                                  </p>
                                ))}
                                {entries.map((e, k) => (
                                  <StandardEntry key={`std-${k}`} entry={e} />
                                ))}
                              </>
                            )
                          }
                        }

                        // Other sections: bullet lines with sub-group headings
                        return section.items.map((item, j) => {
                          const sub = subgroupTitle(item, section.num)
                          if (sub) {
                            return (
                              <div key={j} className="mt-3 first:mt-0 flex items-center gap-2">
                                <span className="h-3.5 w-1 rounded bg-[#1a2744] dark:bg-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[#1a2744] dark:text-blue-300">
                                  {sub}
                                </span>
                              </div>
                            )
                          }

                          const isBullet = /^\s*[•\-*]\s/.test(item)
                          const isSubItem = /^\s{2,}[•\-*]\s/.test(item)
                          const hasLink = /https?:\/\//.test(item)

                          return (
                            <div key={j} className={`text-[15px] leading-relaxed ${
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
                        })
                      })()}
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
