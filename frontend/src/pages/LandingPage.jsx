import React from 'react'

/**
 * LandingPage — Professional government portal landing page.
 * Shows ManakMitra as an official BIS initiative with proper branding.
 */
export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Government Bar */}
      <div className="bg-[#000080] text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>🇮🇳 Government of India</span>
            <span className="text-blue-300">|</span>
            <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-blue-200">
            <span>Bureau of Indian Standards</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* BIS Logo Area */}
            <div className="w-12 h-12 bg-[#000080] rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">BIS</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-[#000080] leading-tight">ManakMitra</h1>
              <p className="text-[10px] text-gray-500 leading-tight">मानक मित्र — AI Assistant for Indian Standards</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-[#000080] transition">Features</a>
            <a href="#standards" className="hover:text-[#000080] transition">Standards</a>
            <a href="#about" className="hover:text-[#000080] transition">About BIS</a>
            <a href="#contact" className="hover:text-[#000080] transition">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm font-medium text-[#000080] hover:text-[#000060] transition px-4 py-2"
            >
              Sign In
            </button>
            <button
              onClick={() => onNavigate('signup')}
              className="text-sm font-semibold text-white bg-[#FF9933] hover:bg-[#E88A2D] px-5 py-2.5 rounded-lg transition shadow-sm"
            >
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#000080] via-[#0000A0] to-[#1a1aff] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 border border-white/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs font-medium">Powered by AI • 23 Standards Indexed • Live</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-6">
              Your AI Guide to<br />
              <span className="text-[#FF9933]">Indian Standards</span>
            </h2>
            <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-2xl">
              ManakMitra helps MSMEs, manufacturers, and consumers understand BIS standards
              in their own language. Ask any question about IS standards — get instant,
              cited answers in 20 Indian languages.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('signup')}
                className="bg-[#FF9933] hover:bg-[#E88A2D] text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => onNavigate('app')}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition backdrop-blur-sm"
              >
                Try Demo
              </button>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-blue-200">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>No registration required for demo</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>20 Indian languages</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span>Voice input supported</span>
              </div>
            </div>
          </div>
        </div>
        {/* Tricolor accent bar */}
        <div className="h-1.5 flex">
          <div className="flex-1 bg-[#FF9933]"></div>
          <div className="flex-1 bg-white"></div>
          <div className="flex-1 bg-[#138808]"></div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '23', label: 'BIS Standards Indexed', icon: '📋' },
              { value: '115', label: 'Knowledge Chunks', icon: '🧠' },
              { value: '20', label: 'Indian Languages', icon: '🌐' },
              { value: '8', label: 'Product Domains', icon: '🏭' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-2xl">{stat.icon}</span>
                <div>
                  <div className="text-2xl font-extrabold text-[#000080]">{stat.value}</div>
                  <div className="text-xs text-gray-500">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">Platform Features</span>
            <h3 className="text-3xl font-extrabold text-[#000080] mt-2">Built for India's MSMEs</h3>
            <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
              ManakMitra combines AI technology with official BIS data to make Indian Standards
              accessible to everyone — from factory owners to consumers.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🗣️',
                title: 'Ask in Your Language',
                desc: 'Type or speak in any of 20 Indian languages. ManakMitra understands Hindi, Tamil, Telugu, Bengali, and more — then answers in your language.',
                color: 'bg-orange-50 border-orange-200'
              },
              {
                icon: '📚',
                title: 'Cited Answers',
                desc: 'Every answer includes the exact IS standard number, section, and clause. You can verify the source yourself — no guessing, no hallucination.',
                color: 'bg-blue-50 border-blue-200'
              },
              {
                icon: '🔄',
                title: 'Auto-Fetch Updates',
                desc: 'When BIS publishes new standards or revisions, ManakMitra automatically discovers and indexes them. Always up to date.',
                color: 'bg-green-50 border-green-200'
              },
              {
                icon: '🧭',
                title: 'Certification Wizard',
                desc: 'Not sure which standard applies? Select your product category and get the exact applicable IS standard, required documents, and process steps.',
                color: 'bg-purple-50 border-purple-200'
              },
              {
                icon: '✅',
                title: 'Verified Confidence',
                desc: 'Every response shows a confidence score based on actual retrieval quality and citation verification — so you know how reliable the answer is.',
                color: 'bg-yellow-50 border-yellow-200'
              },
              {
                icon: '🔒',
                title: 'Offline Ready',
                desc: 'Run with Ollama for fully offline operation. Your data stays on your device. No internet required for search and retrieval.',
                color: 'bg-red-50 border-red-200'
              },
            ].map((feature, i) => (
              <div key={i} className={`${feature.color} border rounded-2xl p-6 hover:shadow-md transition`}>
                <span className="text-3xl">{feature.icon}</span>
                <h4 className="text-lg font-bold text-[#000080] mt-3 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards Covered */}
      <section id="standards" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">Knowledge Base</span>
            <h3 className="text-3xl font-extrabold text-[#000080] mt-2">Standards We Cover</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { domain: '🏗️ Construction', count: 8, standards: ['IS 269', 'IS 456', 'IS 1489', 'IS 383', 'IS 455', 'IS 12040', 'IS 2185', 'IS 16001'] },
              { domain: '⚙️ Steel & Metals', count: 2, standards: ['IS 1786', 'IS 2062'] },
              { domain: '🥛 Food & Dairy', count: 2, standards: ['IS 10500', 'IS 14543'] },
              { domain: '💻 Electronics', count: 2, standards: ['IS 13252', 'IS 15258'] },
              { domain: '👔 Textiles', count: 2, standards: ['IS 1758', 'IS 17091'] },
              { domain: '📦 Packaging', count: 2, standards: ['IS 13726', 'IS 2932'] },
              { domain: '🧪 Materials', count: 2, standards: ['IS 1608', 'IS 383'] },
              { domain: '➕ Auto-Fetched', count: 3, standards: ['IS 17440', 'IS 6307', 'IS 1867'] },
            ].map((d, i) => (
              <div key={i} className="bg-white border rounded-xl p-4 hover:shadow-md transition">
                <div className="font-bold text-[#000080] text-sm">{d.domain}</div>
                <div className="text-xs text-gray-500 mt-1">{d.count} standards</div>
                <div className="mt-2 space-y-1">
                  {d.standards.slice(0, 3).map((s, j) => (
                    <div key={j} className="text-[10px] text-gray-400 font-mono">{s}</div>
                  ))}
                  {d.standards.length > 3 && (
                    <div className="text-[10px] text-blue-500">+{d.standards.length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">For Everyone</span>
            <h3 className="text-3xl font-extrabold text-[#000080] mt-2">Who Uses ManakMitra?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🏭',
                title: 'MSMEs & Manufacturers',
                desc: 'Find applicable IS standards for your product. Get certification guidance. Understand compliance requirements in your language.',
                action: 'Register as MSME',
                color: 'border-[#FF9933]'
              },
              {
                icon: '🛒',
                title: 'Consumers & Traders',
                desc: 'Verify product specifications. Understand quality marks. Check if a product meets Indian safety standards.',
                action: 'Register as Consumer',
                color: 'border-[#000080]'
              },
              {
                icon: '🏛️',
                title: 'BIS Officials',
                desc: 'Access analytics on most-queried standards. Identify knowledge gaps. Track compliance awareness across regions.',
                action: 'Official Login',
                color: 'border-[#138808]'
              },
            ].map((type, i) => (
              <div key={i} className={`border-2 ${type.color} rounded-2xl p-8 text-center hover:shadow-lg transition`}>
                <span className="text-5xl">{type.icon}</span>
                <h4 className="text-xl font-bold text-[#000080] mt-4 mb-3">{type.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">{type.desc}</p>
                <button
                  onClick={() => onNavigate('signup')}
                  className={`text-sm font-semibold px-6 py-2.5 rounded-lg transition ${
                    i === 0 ? 'bg-[#FF9933] text-white hover:bg-[#E88A2D]' :
                    i === 1 ? 'bg-[#000080] text-white hover:bg-[#000060]' :
                    'bg-[#138808] text-white hover:bg-[#0F6D06]'
                  }`}
                >
                  {type.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About BIS */}
      <section id="about" className="py-16 bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-bold text-[#FF9933] uppercase tracking-widest">About</span>
              <h3 className="text-2xl font-extrabold text-[#000080] mt-2 mb-4">Bureau of Indian Standards</h3>
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
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h4 className="font-bold text-[#000080] mb-4">Quick Links</h4>
              <div className="space-y-3">
                {[
                  { label: 'BIS Official Website', url: 'https://www.bis.gov.in' },
                  { label: 'IS Standards Database', url: 'https://standards.bis.gov.in' },
                  { label: 'Product Certification', url: 'https://www.bis.gov.in/product-certification' },
                  { label: 'Smart India Hackathon 2026', url: 'https://sih.gov.in' },
                ].map((link, i) => (
                  <a key={i} href={link.url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition text-sm text-gray-700 hover:text-[#000080]">
                    <span>{link.label}</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#000080]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-extrabold text-white mb-4">Ready to Simplify Indian Standards?</h3>
          <p className="text-blue-200 mb-8">Join thousands of MSMEs already using ManakMitra</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => onNavigate('signup')}
              className="bg-[#FF9933] hover:bg-[#E88A2D] text-white font-bold px-8 py-4 rounded-xl text-base transition shadow-lg"
            >
              Create Free Account
            </button>
            <button
              onClick={() => onNavigate('app')}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl text-base transition"
            >
              Try Without Login
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1a2e] text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#000080] rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">BIS</span>
                </div>
                <span className="text-white font-bold">ManakMitra</span>
              </div>
              <p className="text-xs leading-relaxed">
                AI-powered assistant for Indian Standards. Built for Smart India Hackathon 2026.
              </p>
            </div>
            <div>
              <h5 className="text-white font-semibold text-sm mb-3">Platform</h5>
              <ul className="space-y-2 text-xs">
                <li><a href="#features" className="hover:text-white transition">Features</a></li>
                <li><a href="#standards" className="hover:text-white transition">Standards</a></li>
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
          <div className="border-t border-gray-700 pt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs">© 2026 Bureau of Indian Standards. All rights reserved.</p>
            <p className="text-xs">Smart India Hackathon 2026 • Problem Statement: SIH26107</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
