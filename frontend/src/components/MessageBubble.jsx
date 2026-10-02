import React from 'react'
import { getBISDocumentURL } from '../utils/urls'
import { t } from '../utils/translations'

const LANGUAGE_LABELS = {
  en: '🇬🇧 English', hi: '🇮🇳 हिंदी', bn: '🇮🇳 বাংলা', ta: '🇮🇳 தமிழ்',
  te: '🇮🇳 తెలుగు', mr: '🇮🇳 मराठी', gu: '🇮🇳 ગુજરાતી', ur: '🇮🇳 اردو',
  kn: '🇮🇳 ಕನ್ನಡ', ml: '🇮🇳 മലയാളം', pa: '🇮🇳 ਪੰਜਾਬੀ', or: '🇮🇳 ଓଡ଼ିଆ',
  as: '🇮🇳 অসমীয়া', ne: '🇮🇳 नेपाली', sa: '🇮🇳 संस्कृतम्',
}

// ─── Section icons — simple outline/stroke SVGs (never emoji), navy ───
const SECTION_ICON_PATHS = {
  // Applicable IS Standards — open book
  '1': 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25',
  // Technical Requirements — beaker
  '2': 'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  // Where to Test — map pin
  '3': 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  // Mandatory or Voluntary — balance scale
  '4': 'M12 4v16M8.5 20h7M4.5 8h15M4.5 8L2 13h5L4.5 8zM19.5 8L17 13h5L19.5 8z',
  // Certification Process & Quality Control — clipboard check
  '5': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  // Documents Required — document with text lines
  '6': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}
// Fallback for any future/unknown section number — plain outline document
const FALLBACK_ICON_PATH = 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z'

function SectionIcon({ path, className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  )
}

// Section numbers that have localized titles (sec1..sec6 in uiTranslations)
const KNOWN_SECTIONS = new Set(['1', '2', '3', '4', '5', '6'])

// Title-keyword → section number (label text may change; this mapping must not)
const KEYWORD_SECTION_NUM = {
  'applicable is standard': '1', 'testing requirement': '2', 'technical requirement': '2',
  'where to test': '3', 'mandatory': '4', 'voluntary': '4', 'certification process': '5',
  'documents required': '6', 'documents and information': '6', 'document': '6',
}

// ─── Section 4 verdict detection (mandatory vs voluntary) ───────────────
// Driven purely by what the AI response already says — works across the
// supported languages, with English keywords as a universal fallback.
const VERDICT_KEYWORDS = {
  mandatory: [
    /\bmandatory\b/gi, /\bcompulsory\b/gi,
    /अनिवार्य/g, /बाध्यतामूलक/g, /बंधनकारक/g,
    /ફરજિયાત/g, /اجباری/g, /لازمی/g,
    /বাধ্যতামূলক/g, /கட்டாய/g, /తప్పనిసరి/g,
    /ಕಡ್ಡಾಯ|ಬಾಧ್ಯತ/g, /നിർബന്ധ/g,
    /ਬੰਧਨਕਾਰੀ|ਲੋੜਪੂਰਨ/g, /ବାଧ୍ୟତା|ଆବଶ୍ୟକ/g,
  ],
  voluntary: [
    /\bvoluntary\b/gi,
    /स्वैच्छिक/g, /સ્વૈચ્છિક/g, /اختیاری/g,
    /স্বেচ্ছিক/g, /தன்னார்வ|விருப்ப/g, /స్వచ్ఛంద|ఐచ్ఛిక/g,
    /ಐಚ್ಛಿಕ|ಸ್ವಯಂಪ್ರೇರಿತ/g, /സ്വൈച്ഛിക|ഐച്ഛിക/g,
    /ਸਵੈਚਛਿਕ|ਵਿਕਲਪ/g, /ସ୍ଵେଚ୍ଛ|ଐଚ୍ଛିକ/g,
  ],
}

/**
 * Detect whether Section 4's existing text states the certification is
 * mandatory or voluntary. Question restatements ("Is BIS Certification
 * Mandatory?") are ignored; negations ("no compulsory order", "not
 * voluntary") flip the hit. Returns 'mandatory' | 'voluntary' | null.
 */
function detectVerdict(items) {
  const text = (items || []).filter(l => !l.includes('?')).join('\n')
  if (!text) return null

  const hits = []
  for (const kind of ['mandatory', 'voluntary']) {
    for (const re of VERDICT_KEYWORDS[kind]) {
      re.lastIndex = 0
      let m
      while ((m = re.exec(text))) {
        if (!m[0]) { re.lastIndex += 1; continue }
        const before = text.slice(Math.max(0, m.index - 14), m.index)
        const negated = /\b(?:not|non|no)\s[-\s]*$/i.test(before)
        hits.push({
          kind: negated ? (kind === 'mandatory' ? 'voluntary' : 'mandatory') : kind,
          index: m.index,
        })
      }
    }
  }
  if (hits.length === 0) return null

  const counts = { mandatory: 0, voluntary: 0 }
  hits.forEach(h => { counts[h.kind] += 1 })
  if (counts.mandatory !== counts.voluntary) {
    return counts.mandatory > counts.voluntary ? 'mandatory' : 'voluntary'
  }
  hits.sort((a, b) => a.index - b.index)
  return hits[0].kind
}

/** Field-style lines ("**Gazette Notification:** …") that may follow a
 *  mandatory verdict as structured details. */
function isFieldLine(line) {
  return /^\*\*[^*:]{2,70}:\*\*\s*\S/.test(line) || /^\*\*[^*:]{2,70}:\s*\*\*\s*\S/.test(line)
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
            return <span key={`${i}-${j}`} className="font-mono font-bold text-[var(--bis-navy)] dark:text-blue-300 bg-[#F2F4F7] dark:bg-[#252830] px-1 rounded">{ip}</span>
          }
          return <span key={`${i}-${j}`}>{ip}</span>
        })
      })}
    </span>
  )
}

/**
 * One standard in Section 1: big IS heading, content, "Why this standard
 * applies" card, and an outlined pill button straight to the official
 * government document.
 */
function StandardEntry({ entry, language }) {
  const url = getBISDocumentURL(entry.is, entry.title)

  return (
    <div className="py-3 first:pt-0 border-t border-gray-200/80 dark:border-[#2a2d35] first:border-t-0">
      {/* Big IS heading */}
      <h4 className="flex items-baseline flex-wrap gap-x-2 leading-snug">
        <span className="text-lg sm:text-xl font-bold text-[var(--bis-navy)] dark:text-blue-200">
          {entry.is}
        </span>
        {entry.title && (
          <span className="text-sm font-semibold text-[var(--bis-navy)] dark:text-blue-300">— {entry.title}</span>
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

      {/* Why this standard applies — white card, info icon + bold navy label */}
      {entry.why && (
        <div className="mt-2 rounded-xl border border-gray-200 dark:border-[#2a2d35] bg-white dark:bg-[#1a1d23] px-3.5 py-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <svg
              className="w-4 h-4 flex-shrink-0 text-[var(--bis-navy)] dark:text-blue-300"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M12 11v5" />
              <path d="M12 8h.01" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--bis-navy)] dark:text-blue-300">
              {t('whyThisStandard', language)}
            </span>
          </div>
          <p className="text-[14px] leading-relaxed text-gray-700 dark:text-gray-300">
            <RenderLine line={entry.why} />
          </p>
        </div>
      )}

      {/* Official source — outlined navy pill button */}
      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[var(--bis-navy)] bg-transparent text-[var(--bis-navy)] dark:border-blue-300 dark:text-blue-300 text-[13px] font-semibold px-4 py-1.5 hover:bg-[#E8F0FE] dark:hover:bg-blue-900/30 transition"
        >
          {t('viewSource', language)}
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 3h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  )
}

export default function MessageBubble({ message, onRetry, language = 'en', onNavigate }) {
  const isUser = message.role === 'user'
  const isError = message.isError
  const parsed = !isUser && !isError ? parseStructuredResponse(message.content) : null
  // Language the answer itself was written in (auto-detected from the
  // user's message by the backend) — section headings and in-answer
  // labels follow it, so a Hindi question renders a fully Hindi answer
  // card even while the surrounding UI stays in the selected language.
  const answerLang = !isUser && !isError && message.language ? message.language : language

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
                <div className="rounded-xl bg-[#F2F4F7] dark:bg-[#252830] border border-gray-200 dark:border-[#2a2d35] px-4 py-3">
                  <h2 className="text-base sm:text-lg font-bold leading-snug text-[var(--bis-navy)] dark:text-blue-200">
                    {parsed.heading}
                  </h2>
                </div>
              )}

              {/* Accent badges */}
              {parsed.heading && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#E8F0FE] text-[var(--bis-navy)] px-3 py-1 text-[11px] font-bold tracking-wide">
                    Official BIS Source-Backed
                  </span>
                  <span className="rounded-full bg-[#DCFCE7] text-[#14532D] px-3 py-1 text-[11px] font-bold tracking-wide">
                    Scheme-I (ISI Mark)
                  </span>
                </div>
              )}

              {/* Intro text */}
              {parsed.intro && (
                <p className="text-[15px] text-gray-700 dark:text-gray-300 leading-relaxed">{parsed.intro}</p>
              )}

              {/* Section Cards — unified neutral background, numbered navy headings */}
              {parsed.sections.map((section, i) => {
                const known = KNOWN_SECTIONS.has(section.num)
                const iconPath = SECTION_ICON_PATHS[section.num] || FALLBACK_ICON_PATH
                const title = known ? t(`sec${section.num}`, answerLang) : (section.title || '')
                const sectionNum = String(section.num).padStart(2, '0')

                // Section 4 — verdict callout driven by the existing response text
                const verdict = section.num === '4' ? detectVerdict(section.items) : null
                let renderItems = section.items
                let detailLines = []
                if (section.num === '4' && verdict === 'mandatory') {
                  const fields = section.items.filter(isFieldLine)
                  if (fields.length >= 2) {
                    renderItems = section.items.filter(l => !fields.includes(l))
                    detailLines = fields
                  }
                }
                const sec4Source = (section.items.join(' ').match(/https?:\/\/[^\s)]+/g) || ['https://bis.gov.in'])[0]

                return (
                  <div key={i} className="rounded-xl border bg-white dark:bg-[#1a1d23] border-gray-200 dark:border-[#2a2d35] p-4">
                    {/* Section heading — icon + "NN — Title", single line, navy */}
                    <h3 className="flex items-center gap-2.5 mb-3 text-2xl sm:text-3xl font-bold leading-snug text-[var(--bis-navy)] dark:text-blue-200">
                      <SectionIcon path={iconPath} className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0" />
                      <span>{sectionNum} — {title}</span>
                    </h3>

                    {/* Section 4 — statutory verdict callout */}
                    {verdict && (
                      <div className={`rounded-xl border p-4 mb-4 ${
                        verdict === 'mandatory'
                          ? 'bg-[#FEF2F2] border-red-200 dark:border-red-900/60'
                          : 'bg-[#F0FDF4] border-green-200 dark:border-green-900/60'
                      }`}>
                        <div className={`text-[11px] font-bold uppercase tracking-wider ${
                          verdict === 'mandatory'
                            ? 'text-[#991B1B] dark:text-red-300'
                            : 'text-[#166534] dark:text-green-300'
                        }`}>
                          Statutory Regulatory Status in India:
                        </div>
                        <div className={`mt-1.5 text-2xl sm:text-3xl font-bold leading-tight ${
                          verdict === 'mandatory'
                            ? 'text-[#B91C1C] dark:text-red-300'
                            : 'text-[#15803D] dark:text-green-300'
                        }`}>
                          {verdict === 'mandatory' ? 'MANDATORY (COMPULSORY)' : 'VOLUNTARY'}
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                          {verdict === 'mandatory'
                            ? 'Covered under the BIS Act, 2016 and compulsory certification orders.'
                            : 'Covered under the BIS Act, 2016 — no compulsory certification order applies.'}
                        </p>
                        <a
                          href={sec4Source}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-white text-sm font-semibold transition ${
                            verdict === 'mandatory'
                              ? 'bg-[#B91C1C] hover:bg-[#991B1B]'
                              : 'bg-[#15803D] hover:bg-[#166534]'
                          }`}
                        >
                          {t('viewSource', answerLang)}
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 3h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    )}

                    {/* Section Content */}
                    <div className={`space-y-2 ${
                      verdict ? 'pt-4 border-t border-gray-200 dark:border-[#2a2d35]' : ''
                    }`}>
                      {(() => {
                        // Section 1: each standard as its own block — big heading,
                        // content, "Why this standard applies", official-source button.
                        if (section.num === '1') {
                          const { entries, prelude } = parseStandardEntries(renderItems)
                          if (entries.length > 0) {
                            return (
                              <>
                                {prelude.map((p, k) => (
                                  <p key={`pre-${k}`} className="text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                                    <RenderLine line={p} />
                                  </p>
                                ))}
                                {entries.map((e, k) => (
                                  <StandardEntry key={`std-${k}`} entry={e} language={answerLang} />
                                ))}
                              </>
                            )
                          }
                        }

                        // Other sections: bullet lines with sub-group headings
                        return renderItems.map((item, j) => {
                          const sub = subgroupTitle(item, section.num)
                          if (sub) {
                            return (
                              <div key={j} className="mt-3 first:mt-0 flex items-center gap-2">
                                <span className="h-3.5 w-1 rounded bg-[var(--bis-navy)] dark:bg-blue-400" />
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--bis-navy)] dark:text-blue-300">
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
                                  className="ml-1 text-[10px] text-[var(--bis-navy)] dark:text-blue-300 hover:underline inline-flex items-center gap-0.5"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
                                    <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
                                  </svg>
                                  {t('officialLink', answerLang)}
                                </a>
                              ))}
                            </div>
                          )
                        })
                      })()}
                    </div>

                    {/* Section 4 — structured "why is it mandatory" details (only if
                        the response already contains field-style lines) */}
                    {detailLines.length > 0 && (
                      <div className="mt-4 rounded-xl border border-gray-200 dark:border-[#2a2d35] bg-[#F2F4F7] dark:bg-[#252830] p-4">
                        <div className="text-[12px] font-bold uppercase tracking-wider text-[var(--bis-navy)] dark:text-blue-300 mb-2">
                          Why is it mandatory?
                        </div>
                        <div className="space-y-1.5 text-[15px] leading-relaxed text-gray-700 dark:text-gray-300">
                          {detailLines.map((l, k) => (
                            <p key={k}><RenderLine line={l} /></p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section 3 — testing centres notice */}
                    {section.num === '3' && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg border border-amber-300 bg-[#FFFBEB] px-3.5 py-3">
                        <svg
                          className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <circle cx="12" cy="12" r="9" />
                          <path d="M12 11v5" />
                          <path d="M12 8h.01" />
                        </svg>
                        <p className="text-[14px] leading-relaxed text-gray-800">
                          For more information, please visit the{' '}
                          <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavigate?.('offices') }}
                            className="font-semibold text-[var(--bis-navy)] underline underline-offset-2 hover:opacity-80"
                          >
                            Testing Centres page
                          </a>.
                        </p>
                      </div>
                    )}
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
              className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-lg font-medium transition inline-flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
