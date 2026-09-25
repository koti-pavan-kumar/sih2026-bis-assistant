import React, { useEffect, useRef, useState } from 'react'

/* ============================================================
   ICONS — crisp inline SVG (no emoji = professional look)
   ============================================================ */
const ICON_PATHS = {
  chat: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z',
  book: 'M4 19.5A2.5 2.5 0 016.5 17H20 M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  refresh: 'M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0114.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0020.49 15',
  compass: 'M12 22a10 10 0 100-20 10 10 0 000 20z M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  globe: 'M12 22a10 10 0 100-20 10 10 0 000 20z M2 12h20 M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z',
  mic: 'M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z M19 10v2a7 7 0 01-14 0v-2 M12 19v4 M8 23h8',
  pin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
  award: 'M12 15a7 7 0 100-14 7 7 0 000 14z M8.21 13.89L7 23l5-3 5 3-1.21-9.12',
  arrow: 'M5 12h14 M12 5l7 7-7 7',
  check: 'M20 6L9 17l-5-5',
  search: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
  lock: 'M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z M7 11V7a5 5 0 0110 0v4',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
  users: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75',
  flask: 'M9 2v6.5L4.2 17a2 2 0 001.7 3h12.2a2 2 0 001.7-3L15 8.5V2 M8 2h8 M7.5 14h9',
  building: 'M3 21h18 M5 21V7l7-4 7 4v14 M9 9h.01 M15 9h.01 M9 13h.01 M15 13h.01 M9 17h.01 M15 17h.01',
  file: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8',
  map: 'M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z M8 2v16 M16 6v16',
}

function Icon({ name, className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.8}
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <path d={ICON_PATHS[name] || ICON_PATHS.check} />
    </svg>
  )
}

/* ============================================================
   PARTICLE NETWORK CANVAS — hero background
   ============================================================ */
function ParticleCanvas() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    let raf, particles = []
    const DPR = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      const p = canvas.parentElement
      canvas.width = p.offsetWidth * DPR
      canvas.height = p.offsetHeight * DPR
      canvas.style.width = p.offsetWidth + 'px'
      canvas.style.height = p.offsetHeight + 'px'
    }
    resize()

    const COUNT = Math.min(70, Math.floor(canvas.width / (DPR * 22)))
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35 * DPR,
        vy: (Math.random() - 0.5) * 0.35 * DPR,
        r: (Math.random() * 1.6 + 0.7) * DPR,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.55)'
        ctx.fill()
      }
      const MAX = 130 * DPR
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < MAX) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${0.16 * (1 - d / MAX)})`
            ctx.lineWidth = DPR * 0.6
            ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    draw()
    window.addEventListener('resize', resize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('mm-visible'); io.unobserve(e.target) }
      })
    }, { threshold: 0.1 })
    document.querySelectorAll('.mm-reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  })
}

/* ============================================================
   ANIMATED COUNTER
   ============================================================ */
function Counter({ to, duration = 1500 }) {
  const [n, setN] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (t) => {
        const p = Math.min((t - start) / duration, 1)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])
  return <span ref={ref}>{n}</span>
}

/* ============================================================
   3D TILT CARD
   ============================================================ */
function TiltCard({ children, className = '' }) {
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    e.currentTarget.style.setProperty('--mm-rx', `${(-py * 10).toFixed(2)}deg`)
    e.currentTarget.style.setProperty('--mm-ry', `${(px * 12).toFixed(2)}deg`)
  }
  const onLeave = (e) => {
    e.currentTarget.style.setProperty('--mm-rx', '0deg')
    e.currentTarget.style.setProperty('--mm-ry', '0deg')
  }
  return (
    <div className={`mm-tilt ${className}`} onMouseMove={onMove} onMouseLeave={onLeave}>
      {children}
    </div>
  )
}

/* ============================================================
   TYPEWRITER — multilingual rotating demo query
   ============================================================ */
const DEMO_QUERIES = [
  { q: 'सीमेंट के लिए कौन सा भारतीय मानक लागू है?', a: 'IS 269:2015 — Ordinary Portland Cement, 43 Grade', lang: 'हिन्दी' },
  { q: 'What is the tensile strength required for steel?', a: 'IS 1786:2008 — Fe 500D, min 410 MPa yield strength', lang: 'English' },
  { q: 'పాల ఉత్పత్తులకు ఏ ప్రమాణం వర్తిస్తుంది?', a: 'IS 14543:2016 — Packaged Drinking Water requirements', lang: 'తెలుగు' },
  { q: 'கட்டுமான சிமெண்ட் தரம் என்ன?', a: 'IS 1489:2015 — Portland Pozzolana Cement, Grade 43', lang: 'தமிழ்' },
]

function TypewriterDemo() {
  const [qi, setQi] = useState(0)
  const [len, setLen] = useState(0)
  const [phase, setPhase] = useState('typing') // typing | pause | erasing

  useEffect(() => {
    const full = DEMO_QUERIES[qi].q
    let delay = phase === 'typing' ? 55 : phase === 'pause' ? 2100 : 22
    if (phase === 'typing' && len >= full.length) { delay = 2100; }
    const t = setTimeout(() => {
      if (phase === 'typing') {
        if (len >= full.length) setPhase('pause')
        else setLen(len + 1)
      } else if (phase === 'pause') {
        setPhase('erasing')
      } else {
        if (len === 0) { setQi((qi + 1) % DEMO_QUERIES.length); setPhase('typing') }
        else setLen(len - 1)
      }
    }, delay)
    return () => clearTimeout(t)
  }, [len, phase, qi])

  const demo = DEMO_QUERIES[qi]
  return (
    <div className="mm-glass rounded-2xl p-4 shadow-2xl max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-2 h-2 rounded-full bg-red-400"></span>
        <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
        <span className="w-2 h-2 rounded-full bg-green-400"></span>
        <span className="ml-auto text-[10px] text-blue-200 tracking-wide">ManakMitra Live Demo</span>
      </div>
      <div className="bg-white/95 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <span className="shrink-0 mt-0.5 bg-[#000080] text-white text-[10px] font-bold px-2 py-1 rounded">{demo.lang}</span>
          <p className="text-sm text-gray-800 font-medium mm-caret min-h-[2.4em]">{demo.q.slice(0, len)}</p>
        </div>
        {phase === 'pause' && (
          <div className="mm-pop mt-3 border-l-4 border-[#FF9933] bg-orange-50 p-2.5 rounded-r-lg">
            <p className="text-[11px] font-semibold text-[#000080]">{demo.a}</p>
            <p className="text-[10px] text-green-700 mt-1 flex items-center gap-1">
              <Icon name="check" className="w-3 h-3" /> Source verified • IS standard cited
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   3D FLOATING STANDARD DOCUMENT CARDS
   ============================================================ */
function DocStage() {
  const docs = [
    { id: 'IS 456:2000', title: 'Plain & Reinforced Concrete', tag: 'Construction', color: '#FF9933' },
    { id: 'IS 1786:2008', title: 'High Strength Deformed Bars', tag: 'Steel & Metals', color: '#138808' },
    { id: 'IS 14543:2016', title: 'Packaged Drinking Water', tag: 'Food & Dairy', color: '#4EA8FF' },
  ]
  return (
    <div className="relative mm-stage h-[420px] hidden lg:block" aria-hidden="true">
      {/* rotating chakra watermark */}
      <svg className="mm-chakra absolute -left-10 top-4 w-64 h-64 opacity-[0.12]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="2" />
        <circle cx="50" cy="50" r="8" fill="none" stroke="#fff" strokeWidth="2" />
        {Array.from({ length: 24 }).map((_, i) => (
          <line key={i} x1="50" y1="50" x2={50 + 44 * Math.cos((i * 15 * Math.PI) / 180)}
            y2={50 + 44 * Math.sin((i * 15 * Math.PI) / 180)} stroke="#fff" strokeWidth="1.2" />
        ))}
      </svg>

      {/* orbiting chips */}
      {[
        { label: 'IS 269', r: 235, dur: 26, delay: 0 },
        { label: 'IS 2062', r: 265, dur: 34, delay: -10 },
        { label: 'IS 10500', r: 245, dur: 30, delay: -20 },
      ].map((c) => (
        <span key={c.label}
          className="mm-orbiter mm-glass text-[11px] font-bold text-white px-3 py-1 rounded-full whitespace-nowrap"
          style={{ '--mm-orbit-r': `${c.r}px`, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}>
          {c.label}
        </span>
      ))}

      {/* document cards */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[320px]">
          {docs.map((d, i) => (
            <div key={d.id}
              className="mm-doc absolute w-[300px] rounded-2xl p-5 shadow-2xl"
              style={{
                left: `${i * 26 - 26}px`,
                top: `${i * 74 - 74}px`,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.97), rgba(238,243,255,0.94))',
                border: '1px solid rgba(255,255,255,0.9)',
                transform: `rotateZ(${(i - 1) * 5}deg)`,
                zIndex: 3 - i,
              }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: d.color }}>{d.tag}</div>
                  <div className="text-lg font-extrabold text-[#000080] font-mono mt-0.5">{d.id}</div>
                </div>
                <div className="w-9 h-9 rounded-lg grid place-items-center" style={{ background: `${d.color}22` }}>
                  <Icon name="file" className="w-5 h-5" style={{ color: d.color }} />
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{d.title}</p>
              <div className="mt-3 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${88 - i * 12}%`, background: d.color }} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-gray-400">Indexed & verified</span>
                <span className="text-[10px] font-bold text-green-600 flex items-center gap-1">
                  <Icon name="check" className="w-3 h-3" /> Cited
                </span>
              </div>
            </div>
          ))}
          {/* floating verified badge */}
          <div className="absolute -right-16 top-6 mm-doc mm-glow-ring bg-white rounded-full px-4 py-2 shadow-xl z-10"
            style={{ animationDelay: '-1s' }}>
            <span className="text-[11px] font-bold text-[#000080] flex items-center gap-1.5">
              <Icon name="shield" className="w-4 h-4 text-green-600" /> Verified Sources
            </span>
          </div>
          <div className="absolute -left-24 bottom-2 mm-doc bg-white rounded-2xl px-4 py-3 shadow-xl z-10"
            style={{ animationDelay: '-3s' }}>
            <div className="text-[10px] text-gray-400 font-medium">Response time</div>
            <div className="text-xl font-extrabold text-[#000080]">2.4s</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   MAIN LANDING PAGE
   ============================================================ */
export default function LandingPage({ onNavigate }) {
  useReveal()

  const standardsMarquee = [
    'IS 456:2000', 'IS 1786:2008', 'IS 269:2015', 'IS 2062:2011', 'IS 10500:2012',
    'IS 14543:2016', 'IS 13252:2020', 'IS 2379:2017', 'IS 15489:2012', 'IS 455:2015',
    'IS 12642:2019', 'IS 302:2024', 'IS 15556:2020', 'IS 3289:2018', 'IS 16001:2018',
    'IS 383:2016', 'IS 1489:2015', 'IS 1608:2013', 'IS 17091:2019', 'IS 13726:2019',
  ]

  const languages = [
    'हिन्दी', 'English', 'বাংলা', 'తెలుగు', 'मराठी', 'தமிழ்', 'ગુજરાતી', 'ಕನ್ನಡ',
    'മലയാളം', 'ଓଡ଼ିଆ', 'ਪੰਜਾਬੀ', 'অসমীয়া', 'اردو', 'سنڌي', 'नेपाली', 'संस्कृतम्',
    'मैथिली', 'भोजपुरी', 'राजस्थानी', 'कोंकणी', 'dogri', 'Kiswahili',
  ]

  const stats = [
    { value: 23, suffix: '', label: 'BIS Standards Indexed', icon: 'book' },
    { value: 115, suffix: '', label: 'Knowledge Chunks', icon: 'zap' },
    { value: 22, suffix: '', label: 'Indian Languages', icon: 'globe' },
    { value: 8, suffix: '', label: 'Product Domains', icon: 'building' },
  ]

  const features = [
    { icon: 'chat', title: 'Ask in Your Language', desc: 'Type or speak in any of 22 Indian languages. ManakMitra understands Hindi, Tamil, Telugu, Bengali and more — then answers in the same language.', gradient: 'from-[#FF9933] to-[#FF6B00]' },
    { icon: 'search', title: 'Cited Answers', desc: 'Every answer includes the exact IS standard number, section and clause. Verify the source yourself — no guessing, no hallucination.', gradient: 'from-[#1D6BFF] to-[#000080]' },
    { icon: 'refresh', title: 'Auto-Fetch Updates', desc: 'When BIS publishes new standards or revisions, ManakMitra automatically discovers and indexes them. Always up to date.', gradient: 'from-[#138808] to-[#0A5F05]' },
    { icon: 'compass', title: 'Certification Wizard', desc: 'Not sure which standard applies? Select your product category and get the exact IS standard, required documents and process steps.', gradient: 'from-[#7C3AED] to-[#4C1D95]' },
    { icon: 'flask', title: 'Lab & Office Finder', desc: 'Find the nearest BIS recognized testing laboratory and regional office with phone numbers and direct Google Maps directions.', gradient: 'from-[#0EA5E9] to-[#0369A1]' },
    { icon: 'lock', title: 'Offline Ready', desc: 'Run with Ollama for fully offline operation. Your data stays on your device. No internet required for search and retrieval.', gradient: 'from-[#DC2626] to-[#7F1D1D]' },
  ]

  const domains = [
    { domain: 'Construction', icon: 'building', count: 8, standards: ['IS 269', 'IS 456', 'IS 1489', 'IS 383'], accent: '#FF9933' },
    { domain: 'Steel & Metals', icon: 'zap', count: 2, standards: ['IS 1786', 'IS 2062'], accent: '#1D6BFF' },
    { domain: 'Food & Dairy', icon: 'flask', count: 2, standards: ['IS 10500', 'IS 14543'], accent: '#138808' },
    { domain: 'Electronics', icon: 'shield', count: 2, standards: ['IS 13252', 'IS 15258'], accent: '#7C3AED' },
    { domain: 'Textiles', icon: 'award', count: 2, standards: ['IS 1758', 'IS 17091'], accent: '#DB2777' },
    { domain: 'Packaging', icon: 'file', count: 2, standards: ['IS 13726', 'IS 2932'], accent: '#0EA5E9' },
    { domain: 'Materials', icon: 'search', count: 2, standards: ['IS 1608', 'IS 383'], accent: '#D69E2E' },
    { domain: 'Auto-Fetched', icon: 'refresh', count: 3, standards: ['IS 17440', 'IS 6307', 'IS 1867'], accent: '#059669' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* ================= TOP GOVERNMENT BAR ================= */}
      <div className="bg-[#000080] text-white text-xs py-1.5 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <span>🇮🇳 Government of India</span>
            <span className="text-blue-300 hidden sm:inline">|</span>
            <span className="hidden sm:inline text-blue-200">Ministry of Consumer Affairs, Food & Public Distribution</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-blue-200">
            <span>Bureau of Indian Standards</span>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
      </div>

      {/* ================= HEADER ================= */}
      <header className="bg-white/85 backdrop-blur-xl border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-[#000080] to-[#1a1aff] rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/30">
                <span className="text-white text-xl font-bold">BIS</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#138808] border-2 border-white rounded-full"></span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#000080] leading-tight">ManakMitra</h1>
              <p className="text-[10px] text-gray-500 leading-tight">मानक मित्र — AI Assistant for Indian Standards</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
            {[['Features', '#features'], ['Standards', '#standards'], ['Languages', '#languages'], ['About BIS', '#about'], ['Contact', '#contact']].map(([label, href]) => (
              <a key={href} href={href} className="relative hover:text-[#000080] transition group py-2">
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF9933] to-[#138808] transition-all group-hover:w-full rounded-full"></span>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button onClick={() => onNavigate('login')}
              className="text-sm font-medium text-[#000080] hover:text-[#000060] transition px-4 py-2">
              Sign In
            </button>
            <button onClick={() => onNavigate('signup')}
              className="text-sm font-semibold text-white bg-gradient-to-r from-[#FF9933] to-[#FF6B00] hover:brightness-110 px-5 py-2.5 rounded-lg transition shadow-md shadow-orange-500/30">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #000040 0%, #000080 45%, #1010d0 100%)' }}>
        <ParticleCanvas />
        {/* aurora blobs */}
        <div className="mm-aurora w-[520px] h-[520px] -left-32 -top-32 bg-orange-500/50" style={{ animationDuration: '16s' }}></div>
        <div className="mm-aurora w-[460px] h-[460px] right-0 top-32 bg-emerald-500/35" style={{ animationDuration: '21s', animationDelay: '-6s' }}></div>
        <div className="mm-aurora w-[400px] h-[400px] left-1/3 -bottom-40 bg-sky-500/40" style={{ animationDuration: '18s', animationDelay: '-11s' }}></div>

        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 mm-glass rounded-full px-4 py-1.5 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-xs font-medium">Powered by AI • 23 Standards Indexed • Live</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-extrabold leading-[1.08] mb-6 tracking-tight">
                Your AI Guide to<br />
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#FF9933] via-[#FFC46B] to-[#FF9933] bg-clip-text text-transparent">Indian Standards</span>
                  <span className="absolute left-0 -bottom-2 w-full h-1.5 bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full opacity-90"></span>
                </span>
              </h2>
              <p className="text-lg text-blue-100/90 mb-8 leading-relaxed max-w-2xl">
                ManakMitra helps MSMEs, manufacturers and consumers understand BIS standards
                in their own language. Ask any question about IS standards — get instant,
                cited answers in 22 Indian languages.
              </p>

              {/* typewriter demo */}
              <div className="mb-8"><TypewriterDemo /></div>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => onNavigate('signup')}
                  className="mm-shine bg-gradient-to-r from-[#FF9933] to-[#FF6B00] text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-xl shadow-orange-600/40 hover:scale-[1.03] active:scale-[0.99] transform duration-200">
                  Get Started Free →
                </button>
                <button onClick={() => onNavigate('app')}
                  className="mm-glass hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition hover:scale-[1.03] active:scale-[0.99] duration-200">
                  Try Demo
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-8 text-sm text-blue-200">
                {['No registration required for demo', '22 Indian languages', 'Voice input supported'].map((t) => (
                  <div key={t} className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-green-500/25 border border-green-400/60 grid place-items-center">
                      <Icon name="check" className="w-3 h-3 text-green-300" />
                    </span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>

            <DocStage />
          </div>
        </div>

        {/* tricolor accent bar */}
        <div className="h-1.5 flex relative z-10">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>
      </section>

      {/* ================= STANDARDS MARQUEE ================= */}
      <div className="mm-marquee-wrap bg-[#000040] py-3 overflow-hidden border-y border-white/10">
        <div className="mm-marquee-track">
          {[...standardsMarquee, ...standardsMarquee].map((s, i) => (
            <span key={i} className="mx-6 text-xs font-mono font-bold text-blue-300/80 whitespace-nowrap flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF9933]"></span>{s}
            </span>
          ))}
        </div>
      </div>

      {/* ================= STATS ================= */}
      <section className="bg-gradient-to-b from-gray-50 to-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <TiltCard key={i} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl p-5 transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#000080] to-[#1a1aff] grid place-items-center shadow-md shadow-blue-900/25">
                    <Icon name={stat.icon} className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-[#000080] tracking-tight">
                      <Counter to={stat.value} />{stat.suffix}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">{stat.label}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-24 bg-white relative overflow-hidden mm-grid-bg">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-16 mm-reveal">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">Platform Features</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#000080] mt-2">Built for India's MSMEs</h3>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              ManakMitra combines AI technology with official BIS data to make Indian Standards
              accessible to everyone — from factory owners to consumers.
            </p>
            <div className="mx-auto mt-4 w-24 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            {features.map((f, i) => (
              <div key={i} className="mm-reveal" style={{ transitionDelay: `${i * 70}ms` }}>
                <TiltCard className="h-full">
                  <div className="relative bg-white border border-gray-200 rounded-2xl p-6 h-full mm-edge hover:shadow-2xl hover:shadow-blue-900/10 transition-shadow overflow-hidden group">
                    <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full bg-gradient-to-br ${f.gradient} opacity-[0.07] group-hover:opacity-[0.16] group-hover:scale-150 transition-all duration-500`}></div>
                    <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${f.gradient} grid place-items-center shadow-lg mb-4 group-hover:rotate-6 transition-transform duration-300`}>
                      <Icon name={f.icon} className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="relative text-lg font-bold text-[#000080] mb-2">{f.title}</h4>
                    <p className="relative text-sm text-gray-600 leading-relaxed">{f.desc}</p>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= LIVE DEMO PREVIEW ================= */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000040, #000080 60%, #1010c8)' }}>
        <div className="mm-aurora w-[420px] h-[420px] -right-20 top-10 bg-orange-500/40" style={{ animationDuration: '19s' }}></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="mm-reveal">
              <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">See It In Action</span>
              <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4">One Question. A Complete Compliance Roadmap.</h3>
              <p className="text-blue-200 leading-relaxed mb-6">
                Every answer arrives as a structured six-section report — applicable standards with sources,
                required tests, nearest testing centres, legal obligations, certification process and the
                complete document checklist.
              </p>
              <div className="space-y-3">
                {[
                  ['book', 'Applicable IS Standards — with cited sources'],
                  ['flask', 'Testing Requirements — methods & criteria'],
                  ['pin', 'Where to Test — nearest BIS offices & labs'],
                  ['shield', 'Mandatory or Voluntary — legal basis explained'],
                  ['award', 'Certification Process — official application link'],
                  ['file', 'Documents Required — complete checklist'],
                ].map(([icon, text], i) => (
                  <div key={i} className="mm-glass rounded-xl px-4 py-3 flex items-center gap-3 hover:bg-white/15 transition mm-pop"
                    style={{ animationDelay: `${i * 120}ms` }}>
                    <span className="w-8 h-8 rounded-lg bg-[#FF9933] grid place-items-center shrink-0">
                      <Icon name={icon} className="w-4 h-4 text-white" />
                    </span>
                    <span className="text-sm text-blue-100">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* animated chat mockup */}
            <div className="mm-reveal">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-[#000080] px-5 py-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/15 rounded-lg grid place-items-center text-white text-xs font-bold">BIS</div>
                  <div className="text-white">
                    <div className="text-sm font-semibold leading-tight">ManakMitra</div>
                    <div className="text-[10px] text-blue-300 leading-tight">मानक मित्र — AI Assistant</div>
                  </div>
                  <span className="ml-auto text-[10px] text-green-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Online
                  </span>
                </div>
                <div className="p-5 space-y-4 bg-gray-50">
                  <div className="flex justify-end">
                    <div className="bg-[#000080] text-white text-sm px-4 py-2.5 rounded-2xl rounded-br-md max-w-[80%]">
                      What are the standards for packaged drinking water?
                    </div>
                  </div>
                  <div className="mm-pop flex justify-start" style={{ animationDelay: '0.3s' }}>
                    <div className="bg-white border border-gray-200 text-sm px-4 py-3 rounded-2xl rounded-bl-md max-w-[90%] shadow-sm">
                      <div className="font-bold text-[#000080] text-xs mb-1.5">1. Applicable IS Standards</div>
                      <div className="text-gray-600 text-[13px] leading-relaxed">
                        IS 14543:2016 applies to packaged drinking water. Source: retrieved clause 4.1 —
                        scope covers water processed by filtration and sterilisation.
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {['IS 14543', 'IS 10500'].map((s) => (
                          <span key={s} className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.5 rounded">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mm-pop grid grid-cols-3 gap-2" style={{ animationDelay: '0.7s' }}>
                    {[['22', 'Languages'], ['6', 'Sections'], ['100%', 'Cited']].map(([v, l]) => (
                      <div key={l} className="bg-white border border-gray-200 rounded-xl p-2.5 text-center">
                        <div className="text-base font-extrabold text-[#000080]">{v}</div>
                        <div className="text-[9px] text-gray-400 uppercase tracking-wide">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= LANGUAGES ================= */}
      <section id="languages" className="py-24 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 mm-reveal">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">Multilingual Reach</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#000080] mt-2">22 Indian Languages, One Assistant</h3>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">Ask in your language — ManakMitra auto-detects it, searches the standards, and answers back in the same language.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto mm-reveal">
            {languages.map((lang, i) => (
              <span key={i}
                className="px-4 py-2 rounded-full text-sm font-medium border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#000080] hover:text-white hover:border-[#000080] hover:scale-110 hover:shadow-lg hover:shadow-blue-900/25 transition-all duration-200 cursor-default"
                style={{ transitionDelay: `${i * 15}ms` }}>
                {lang}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STANDARDS COVERED ================= */}
      <section id="standards" className="py-24 bg-gradient-to-b from-gray-50 to-white relative mm-grid-bg">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="text-center mb-12 mm-reveal">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">Knowledge Base</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#000080] mt-2">Standards We Cover</h3>
            <div className="mx-auto mt-4 w-24 h-1 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {domains.map((d, i) => (
              <div key={i} className="mm-reveal" style={{ transitionDelay: `${i * 60}ms` }}>
                <TiltCard className="h-full">
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 h-full hover:shadow-xl transition-shadow group relative overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-1 opacity-0 group-hover:opacity-100 transition" style={{ background: `linear-gradient(90deg, ${d.accent}, transparent)` }}></div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl grid place-items-center" style={{ background: `${d.accent}18` }}>
                        <Icon name={d.icon} className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-[#000080] text-sm">{d.domain}</div>
                        <div className="text-xs text-gray-400">{d.count} standards</div>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d.standards.map((s) => (
                        <span key={s} className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border"
                          style={{ color: d.accent, borderColor: `${d.accent}44`, background: `${d.accent}0D` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= USER TYPES ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 mm-reveal">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">For Everyone</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-[#000080] mt-2">Who Uses ManakMitra?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: 'building', title: 'MSMEs & Manufacturers', desc: 'Find applicable IS standards for your product. Get certification guidance. Understand compliance requirements in your language.', action: 'Register as MSME', from: '#FF9933', to: '#FF6B00' },
              { icon: 'users', title: 'Consumers & Traders', desc: 'Verify product specifications. Understand quality marks. Check if a product meets Indian safety standards.', action: 'Register as Consumer', from: '#1D6BFF', to: '#000080' },
              { icon: 'shield', title: 'BIS Officials', desc: 'Access analytics on most-queried standards. Identify knowledge gaps. Track compliance awareness across regions.', action: 'Official Login', from: '#138808', to: '#0A5F05' },
            ].map((type, i) => (
              <div key={i} className="mm-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <TiltCard className="h-full">
                  <div className="bg-white border-2 border-gray-100 rounded-3xl p-8 text-center h-full hover:border-gray-200 hover:shadow-2xl transition-all relative overflow-hidden group">
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500"
                      style={{ background: `linear-gradient(135deg, ${type.from}, ${type.to})` }}></div>
                    <div className="relative w-16 h-16 mx-auto rounded-2xl grid place-items-center shadow-lg mb-5 group-hover:-translate-y-1 transition-transform"
                      style={{ background: `linear-gradient(135deg, ${type.from}, ${type.to})` }}>
                      <Icon name={type.icon} className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="relative text-xl font-bold text-[#000080] mb-3">{type.title}</h4>
                    <p className="relative text-sm text-gray-600 leading-relaxed mb-7">{type.desc}</p>
                    <button onClick={() => onNavigate('signup')}
                      className="relative text-sm font-semibold text-white px-6 py-3 rounded-xl transition hover:scale-105 active:scale-95 shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${type.from}, ${type.to})` }}>
                      {type.action}
                    </button>
                  </div>
                </TiltCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ABOUT BIS ================= */}
      <section id="about" className="py-20 bg-gray-50 border-t relative overflow-hidden">
        <div className="absolute -right-32 -bottom-32 w-96 h-96 rounded-full bg-[#000080] opacity-[0.04]"></div>
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="mm-reveal">
              <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">About</span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-[#000080] mt-2 mb-4">Bureau of Indian Standards</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                The Bureau of Indian Standards (BIS) is the National Standards Body of India working
                under the Ministry of Consumer Affairs, Food & Public Distribution. BIS is responsible
                for the harmonious development of standardization, marking, and quality certification
                of goods.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                ManakMitra is built as a Smart India Hackathon 2026 project to make BIS standards
                more accessible to MSMEs and consumers through AI-powered search and multilingual support.
              </p>
            </div>
            <div className="bg-white border rounded-2xl p-6 shadow-lg mm-reveal">
              <h4 className="font-bold text-[#000080] mb-4 flex items-center gap-2">
                <Icon name="arrow" className="w-4 h-4 text-[#FF9933]" /> Quick Links
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'BIS Official Website', url: 'https://www.bis.gov.in' },
                  { label: 'IS Standards Database', url: 'https://standards.bis.gov.in' },
                  { label: 'Product Certification', url: 'https://www.bis.gov.in/product-certification' },
                  { label: 'Smart India Hackathon 2026', url: 'https://sih.gov.in' },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 bg-gray-50 rounded-xl hover:bg-blue-50 transition text-sm text-gray-700 hover:text-[#000080] group border border-transparent hover:border-blue-100">
                    <span className="font-medium">{link.label}</span>
                    <span className="w-6 h-6 rounded-full bg-gray-200 group-hover:bg-[#000080] group-hover:text-white grid place-items-center transition">
                      <Icon name="arrow" className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #000040, #000080 50%, #1010c8)' }}>
        <div className="mm-aurora w-[500px] h-[500px] left-1/4 -top-40 bg-orange-500/40" style={{ animationDuration: '17s' }}></div>
        <div className="mm-aurora w-[400px] h-[400px] right-10 -bottom-32 bg-emerald-500/35" style={{ animationDuration: '22s', animationDelay: '-8s' }}></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 mm-reveal">
          <h3 className="text-3xl md:text-5xl font-extrabold text-white mb-5 leading-tight">Ready to Simplify<br />Indian Standards?</h3>
          <p className="text-blue-200 mb-9 text-lg">Join thousands of MSMEs already using ManakMitra</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => onNavigate('signup')}
              className="mm-shine bg-gradient-to-r from-[#FF9933] to-[#FF6B00] text-white font-bold px-9 py-4 rounded-xl text-base transition shadow-xl shadow-orange-600/40 hover:scale-105 active:scale-95 duration-200">
              Create Free Account
            </button>
            <button onClick={() => onNavigate('app')}
              className="mm-glass hover:bg-white/20 text-white font-semibold px-9 py-4 rounded-xl text-base transition hover:scale-105 active:scale-95 duration-200">
              Try Without Login
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#0a0a1e] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#000080] to-[#1a1aff] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BIS</span>
                </div>
                <span className="text-white font-bold">ManakMitra</span>
              </div>
              <p className="text-xs leading-relaxed">
                AI-powered assistant for Indian Standards. Built for Smart India Hackathon 2026.
              </p>
              <div className="mt-4 h-1 w-20 rounded-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808]"></div>
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Platform</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#standards" className="hover:text-white transition">Standards</a></li>
                <li><a href="#languages" className="hover:text-white transition">Languages</a></li>
                <li><button onClick={() => onNavigate('login')} className="hover:text-white transition">Sign In</button></li>
                <li><button onClick={() => onNavigate('signup')} className="hover:text-white transition">Register</button></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Resources</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">BIS Website</a></li>
                <li><a href="https://standards.bis.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">IS Database</a></li>
                <li><a href="https://sih.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">SIH 2026</a></li>
              </ul>
            </div>
            <div id="contact">
              <h5 className="text-white font-semibold text-sm mb-3">Contact</h5>
              <ul className="space-y-2 text-xs">
                <li>Bureau of Indian Standards</li>
                <li>Manak Bhawan, 9 Bahadur Shah Zafar Marg</li>
                <li>New Delhi - 110002</li>
                <li className="text-blue-400">www.bis.gov.in</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs">© 2026 Bureau of Indian Standards. All rights reserved.</p>
            <p className="text-xs">Smart India Hackathon 2026 • Problem Statement: SIH26107</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
