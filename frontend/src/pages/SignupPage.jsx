import React, { useState } from 'react'
import { register, login } from '../utils/auth'

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
]

/**
 * SignupPage — Professional government-style registration page.
 * One registration for everyone: personal info + location only.
 * Stores registered users in localStorage.
 */
export default function SignupPage({ onNavigate }) {
  const [step, setStep] = useState(1)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    state: '',
    district: '',
  })

  const update = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('') // Clear error on any input change
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')

    // Validate required fields
    if (!formData.name.trim()) { setError('Please enter your full name.'); return }
    if (!formData.email.trim()) { setError('Please enter your email address.'); return }
    if (!formData.phone.trim()) { setError('Please enter your phone number.'); return }
    if (!formData.password) { setError('Please enter a password.'); return }
    if (formData.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    if (formData.password !== formData.confirmPassword) { setError('Passwords do not match.'); return }
    if (!formData.state) { setError('Please select your state.'); return }

    // Attempt registration
    const result = register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
      state: formData.state,
      district: formData.district,
    })

    if (!result.success) {
      setError(result.error)
      return
    }

    // Registration successful — move to step 2
    setStep(2)
  }

  const handleGoToApp = () => {
    // Log in the newly registered user
    const result = login(formData.email, formData.password)
    if (result.success) {
      localStorage.removeItem('manakmitra_chat_history')
      onNavigate('app')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
            {[1, 2].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    step >= s ? 'bg-[#000080] text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1">
                    {s === 1 ? 'Details' : 'Complete'}
                  </span>
                </div>
                {s < 2 && (
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
              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <span className="text-red-500 text-sm mt-0.5">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Step 1: Details Form */}
              {step === 1 && (
                <form onSubmit={handleRegister}>
                  <div className="flex items-center gap-2 mb-6">
                    <button type="button" onClick={() => { onNavigate('landing'); setError('') }} className="text-gray-400 hover:text-gray-600">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    </button>
                    <div>
                      <h2 className="text-lg font-bold text-[#000080]">Create your account</h2>
                      <p className="text-xs text-gray-500">Step 1 of 2 — Your details</p>
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

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password *</label>
                        <input type="password" value={formData.password} onChange={(e) => update('password', e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Confirm Password *</label>
                        <input type="password" value={formData.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)}
                          placeholder="Re-enter password"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080]" />
                      </div>
                    </div>

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
                      Register →
                    </button>

                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem('manakmitra_chat_history')
                          localStorage.setItem('manakmitra_user', JSON.stringify({
                            name: 'Guest', email: '', userType: 'guest', loggedIn: false,
                          }))
                          onNavigate('app')
                        }}
                        className="text-sm text-gray-400 hover:text-[#000080] transition"
                      >
                        Skip registration → Try demo
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 2: Complete */}
              {step === 2 && (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-[#000080] mb-2">Registration Complete!</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    Welcome, <strong>{formData.name}</strong>!
                  </p>
                  <p className="text-xs text-gray-400 mb-6">
                    Your account ({formData.email}) has been created successfully.
                  </p>
                  <button
                    onClick={handleGoToApp}
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
