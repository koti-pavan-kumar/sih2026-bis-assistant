import React, { useState } from 'react'

/**
 * SignupPage — Professional government-style registration page.
 * Multi-step form with user type, personal info, and organization details.
 */
export default function SignupPage({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    organization: '',
    gstNumber: '',
    state: '',
    district: '',
  })

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    // Clear previous user's chat history before entering app
    localStorage.removeItem('manakmitra_chat_history')
    onNavigate('app')
  }

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat',
    'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
    'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Government Bar */}
      <div className="bg-[#000080] text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <span>🇮🇳 Government of India</span>
          <span className="text-blue-300">|</span>
          <span>Ministry of Consumer Affairs, Food & Public Distribution</span>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <button onClick={() => onNavigate('landing')} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#000080] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">BIS</span>
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-[#000080] leading-tight">ManakMitra</h1>
              <p className="text-[9px] text-gray-500">मानक मित्र</p>
            </div>
          </button>
          <button
            onClick={() => onNavigate('login')}
            className="text-sm text-[#000080] hover:text-[#000060] font-medium"
          >
            Already registered? Sign In →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-lg">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s ? 'bg-[#000080] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {s === 1 ? 'User Type' : s === 2 ? 'Details' : 'Complete'}
                  </span>
                </div>
                {s < 3 && (
                  <div className={`w-16 h-0.5 mx-2 mt-[-16px] ${
                    step > s ? 'bg-[#000080]' : 'bg-gray-200'
                  }`}></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="h-1.5 flex">
              <div className="flex-1 bg-[#FF9933]"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-[#138808]"></div>
            </div>

            <div className="p-8">
              {/* Step 1: User Type */}
              {step === 1 && (
                <div>
                  <h2 className="text-xl font-bold text-[#000080] text-center mb-2">Register on ManakMitra</h2>
                  <p className="text-sm text-gray-500 text-center mb-6">Select your user type</p>

                  <div className="space-y-3">
                    {[
                      { id: 'msme', icon: '🏭', title: 'MSME / Manufacturer', desc: 'Find standards for your products, get certification guidance', color: 'border-[#FF9933] hover:bg-orange-50' },
                      { id: 'individual', icon: '👤', title: 'Individual / Consumer', desc: 'Verify product specifications, check quality standards', color: 'border-[#000080] hover:bg-blue-50' },
                      { id: 'official', icon: '🏛️', title: 'BIS Official', desc: 'Access analytics, track compliance awareness', color: 'border-[#138808] hover:bg-green-50' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => { setUserType(type.id); setStep(2) }}
                        className={`w-full text-left p-5 border-2 rounded-xl transition ${type.color} ${
                          userType === type.id ? 'ring-2 ring-[#000080]' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{type.icon}</span>
                          <div>
                            <div className="font-bold text-[#000080]">{type.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{type.desc}</div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Demo skip */}
                  <div className="mt-6 text-center">
                    <button
                      onClick={() => {
                        localStorage.removeItem('manakmitra_chat_history')
                        onNavigate('app')
                      }}
                      className="text-sm text-gray-400 hover:text-[#000080] transition"
                    >
                      Skip registration → Try demo
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Details Form */}
              {step === 2 && (
                <form onSubmit={(e) => { e.preventDefault(); setStep(3) }}>
                  <div className="flex items-center gap-2 mb-6">
                    <button type="button" onClick={() => setStep(1)} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-[#000080]">
                        {userType === 'msme' ? 'MSME Registration' : userType === 'official' ? 'Official Registration' : 'Individual Registration'}
                      </h2>
                      <p className="text-xs text-gray-500">Step 2 of 3 — Your details</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => update('name', e.target.value)}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email *</label>
                        <input type="email" value={formData.email} onChange={(e) => update('email', e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Phone *</label>
                        <input type="tel" value={formData.phone} onChange={(e) => update('phone', e.target.value)}
                          placeholder="+91 XXXXX XXXXX"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
                      <input type="password" value={formData.password} onChange={(e) => update('password', e.target.value)}
                        placeholder="Min 8 characters"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                    </div>

                    {userType === 'msme' && (
                      <>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">Organization Name *</label>
                          <input type="text" value={formData.organization} onChange={(e) => update('organization', e.target.value)}
                            placeholder="Your company/factory name"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">GST Number (optional)</label>
                          <input type="text" value={formData.gstNumber} onChange={(e) => update('gstNumber', e.target.value)}
                            placeholder="22AAAAA0000A1Z5"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                        </div>
                      </>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">State *</label>
                        <select value={formData.state} onChange={(e) => update('state', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] bg-white">
                          <option value="">Select state</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                        <input type="text" value={formData.district} onChange={(e) => update('district', e.target.value)}
                          placeholder="Your district"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="flex items-start gap-2 text-xs text-gray-600 mb-4">
                      <input type="checkbox" className="mt-0.5 rounded border-gray-300" required />
                      <span>I agree to the Terms of Service and Privacy Policy. I confirm that the information provided is accurate.</span>
                    </label>

                    <button type="submit"
                      className="w-full bg-[#000080] hover:bg-[#000060] text-white font-bold py-3 rounded-xl text-sm transition shadow-sm">
                      Continue →
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: Complete */}
              {step === 3 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-[#000080] mb-2">Registration Complete!</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Your account has been created. You can now access ManakMitra and start querying Indian Standards.
                  </p>
                  <button
                    onClick={() => {
                      localStorage.removeItem('manakmitra_chat_history')
                      onNavigate('app')
                    }}
                    className="bg-[#FF9933] hover:bg-[#E88A2D] text-white font-bold px-8 py-3 rounded-xl text-sm transition shadow-sm"
                  >
                    Go to ManakMitra →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© 2026 Bureau of Indian Standards</span>
          <span>SIH 2026 • PS ID: SIH26107</span>
        </div>
      </footer>
    </div>
  )
}
