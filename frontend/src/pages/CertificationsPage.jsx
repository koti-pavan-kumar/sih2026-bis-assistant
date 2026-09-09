import React, { useState, useEffect } from 'react'

const STEP_STATUS_ICONS = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

/**
 * CertificationsPage — Full-page BIS certification guide.
 * Shows certification types, step-by-step processes, fees, documents, and FAQs.
 */
export default function CertificationsPage({ onNavigate, language, darkMode }) {
  const [certifications, setCertifications] = useState([])
  const [selectedCert, setSelectedCert] = useState(null)
  const [faqs, setFaqs] = useState([])
  const [expandedFaq, setExpandedFaq] = useState(null)
  const [activeSection, setActiveSection] = useState('types') // types | process | faq

  useEffect(() => {
    fetch('/api/certifications')
      .then(r => r.json())
      .then(d => setCertifications(d.certifications || []))
      .catch(() => {})

    fetch('/api/certifications/faqs')
      .then(r => r.json())
      .then(d => setFaqs(d.faqs || []))
      .catch(() => {})
  }, [])

  const loadCertDetail = async (certId) => {
    try {
      const res = await fetch(`/api/certifications/${certId}`)
      const data = await res.json()
      setSelectedCert(data)
      setActiveSection('process')
    } catch (err) {
      console.error('Failed to load cert detail:', err)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1a2744] via-[#1e3a5f] to-[#0f1a2e] text-white py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={() => onNavigate('app')}
            className="text-blue-300 hover:text-white text-xs mb-4 flex items-center gap-1"
          >
            ← Back to ManakMitra
          </button>
          <h1 className="text-3xl font-bold mb-2">📋 BIS Certification Guide</h1>
          <p className="text-blue-200 text-sm max-w-2xl">
            Complete guide to obtaining Bureau of Indian Standards certifications — ISI Mark, Hallmark, Eco Mark, and more.
            Step-by-step process, required documents, fees, and FAQs.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Section Tabs */}
        <div className="flex gap-1 mb-8 border-b border-gray-200 dark:border-[#2a2d35]">
          {[
            { id: 'types', label: '🏷️ Certification Types' },
            { id: 'process', label: '📝 Process & Documents' },
            { id: 'faq', label: '❓ FAQs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition border-b-2 ${
                activeSection === tab.id
                  ? 'text-[#1a2744] dark:text-blue-300 border-[#1a2744] dark:border-blue-300'
                  : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Certification Types Grid */}
        {activeSection === 'types' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Types of BIS Certifications</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Choose the certification relevant to your product category
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map(cert => (
                <div
                  key={cert.id}
                  onClick={() => loadCertDetail(cert.id)}
                  className={`card-govt p-5 cursor-pointer transition group ${
                    selectedCert?.id === cert.id ? 'ring-2 ring-[#1a2744] dark:ring-blue-500' : ''
                  }`}
                >
                  <div className="text-3xl mb-3">{cert.icon}</div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-[#1a2744] dark:group-hover:text-blue-300 transition">
                    {cert.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                    {cert.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                      ⏱️ {cert.total_duration}
                    </span>
                    {cert.mandatory_products_count > 0 && (
                      <span className="text-[10px] px-2 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300">
                        {cert.mandatory_products_count} products
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Process & Documents */}
        {activeSection === 'process' && (
          <div>
            {!selectedCert ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Select a certification type above to see the step-by-step process
                </p>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                  {certifications.map(cert => (
                    <button
                      key={cert.id}
                      onClick={() => loadCertDetail(cert.id)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-[#2a2d35] hover:border-[#1a2744] dark:hover:border-blue-500 transition text-left"
                    >
                      <span className="text-xl">{cert.icon}</span>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{cert.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <button
                  onClick={() => setActiveSection('types')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-4 flex items-center gap-1"
                >
                  ← All certifications
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{selectedCert.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedCert.name}</h2>
                    <p className="text-xs text-gray-500">{selectedCert.full_name}</p>
                  </div>
                </div>

                {/* Mandatory Products */}
                {selectedCert.mandatory_products?.length > 0 && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 mb-6">
                    <h3 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2">
                      ⚠️ Mandatory Products ({selectedCert.mandatory_products.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                      {selectedCert.mandatory_products.map((p, i) => (
                        <div key={i} className="text-[11px] text-orange-700 dark:text-orange-300 flex items-center gap-1">
                          <span className="text-orange-400">•</span> {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Process Steps */}
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">📝 Step-by-Step Process</h3>
                <div className="space-y-4">
                  {selectedCert.process_steps?.map((step, i) => (
                    <div key={i} className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a2744] dark:bg-blue-900/30 text-white flex items-center justify-center text-sm font-bold shrink-0">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{step.title}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 font-medium">
                              ⏱️ {step.duration}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{step.description}</p>

                          {step.documents_needed?.length > 0 && (
                            <div className="mb-2">
                              <span className="text-[10px] font-semibold text-gray-500 uppercase">Documents Needed:</span>
                              <ul className="mt-1 space-y-0.5">
                                {step.documents_needed.map((doc, j) => (
                                  <li key={j} className="text-[11px] text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                    <span className="text-green-500 mt-0.5">✓</span> {doc}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {step.tips && (
                            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-2 text-[10px] text-yellow-700 dark:text-yellow-300">
                              💡 <strong>Tip:</strong> {step.tips}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Fees */}
                {selectedCert.fees && (
                  <div className="mt-6 bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💰 Fee Structure</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(selectedCert.fees).filter(([k]) => k !== 'note').map(([key, val]) => (
                        <div key={key} className="bg-gray-50 dark:bg-[#0f1115] rounded-lg p-3">
                          <div className="text-[10px] text-gray-500 uppercase mb-1">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white">{val}</div>
                        </div>
                      ))}
                    </div>
                    {selectedCert.fees.note && (
                      <p className="text-[10px] text-gray-500 mt-3 italic">ℹ️ {selectedCert.fees.note}</p>
                    )}
                  </div>
                )}

                {/* Hallmark Components */}
                {selectedCert.hallmark_components && (
                  <div className="mt-6 bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3">💎 Hallmark Components</h3>
                    <div className="space-y-2">
                      {selectedCert.hallmark_components.map((comp, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-gray-700 dark:text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 flex items-center justify-center text-[10px] font-bold">
                            {i + 1}
                          </span>
                          {comp}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits */}
                {selectedCert.benefits && (
                  <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-5">
                    <h3 className="text-sm font-bold text-green-800 dark:text-green-300 mb-3">✅ Benefits</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedCert.benefits.map((b, i) => (
                        <div key={i} className="text-xs text-green-700 dark:text-green-300 flex items-center gap-1">
                          <span className="text-green-500">✓</span> {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Renewal & Penalties */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedCert.renewal && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-blue-800 dark:text-blue-300 mb-1">🔄 Renewal</h4>
                      <p className="text-[11px] text-blue-700 dark:text-blue-300">{selectedCert.renewal}</p>
                    </div>
                  )}
                  {selectedCert.penalties && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                      <h4 className="text-xs font-bold text-red-800 dark:text-red-300 mb-1">⚠️ Penalties</h4>
                      <p className="text-[11px] text-red-700 dark:text-red-300">{selectedCert.penalties}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAQs */}
        {activeSection === 'faq' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Frequently Asked Questions</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Common questions about BIS certification process
            </p>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-[#1a1d23] border border-gray-200 dark:border-[#2a2d35] rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#1a1d23] transition"
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-white pr-4">{faq.question}</span>
                    <span className={`text-gray-400 transition-transform ${expandedFaq === i ? 'rotate-180' : ''}`}>
                      ▼
                    </span>
                  </button>
                  {expandedFaq === i && (
                    <div className="px-5 pb-4 text-xs text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-[#2a2d35] pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
