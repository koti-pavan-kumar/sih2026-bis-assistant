import React, { useState } from 'react'
import { login, setGuest } from '../utils/auth'

/**
 * LoginPage — Professional government-style login page.
 * Validates credentials against registered users stored in localStorage.
 */
export default function LoginPage({ onNavigate }) {
  const [userType, setUserType] = useState('msme')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validate inputs
    if (!email.trim()) { setError('Please enter your email address.'); return }
    if (!password) { setError('Please enter your password.'); return }

    setLoading(true)

    // Small delay to simulate network check
    setTimeout(() => {
      const result = login(email, password)

      if (!result.success) {
        setError(result.error)
        setLoading(false)
        return
      }

      // Login successful — clear old chat, go to app
      localStorage.removeItem('manakmitra_chat_history')
      setLoading(false)
      onNavigate('app')
    }, 400)
  }

  const handleDemoLogin = () => {
    setGuest()
    localStorage.removeItem('manakmitra_chat_history')
    onNavigate('app')
  }

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
            onClick={() => onNavigate('signup')}
            className="text-sm text-[#000080] hover:text-[#000060] font-medium"
          >
            New user? Register →
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Tricolor accent */}
            <div className="h-1.5 flex">
              <div className="flex-1 bg-[#FF9933]"></div>
              <div className="flex-1 bg-white"></div>
              <div className="flex-1 bg-[#138808]"></div>
            </div>

            <div className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-[#000080]">Sign In to ManakMitra</h2>
                <p className="text-sm text-gray-500 mt-1">Access Indian Standards in your language</p>
              </div>

              {/* User Type Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
                {[
                  { id: 'msme', label: 'MSME', icon: '🏭' },
                  { id: 'individual', label: 'Individual', icon: '👤' },
                  { id: 'official', label: 'BIS Official', icon: '🏛️' },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setUserType(type.id)}
                    className={`flex-1 py-2.5 text-xs font-semibold rounded-md transition ${
                      userType === type.id
                        ? 'bg-white text-[#000080] shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {type.icon} {type.label}
                  </button>
                ))}
              </div>

              {/* Error Banner */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <span className="text-red-500 text-sm mt-0.5">⚠️</span>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {userType === 'official' ? 'Official Email ID' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError('') }}
                    placeholder={userType === 'official' ? 'official@bis.gov.in' : 'you@company.com'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setError('') }}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:border-[#000080] focus:ring-1 focus:ring-[#000080] transition pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-bold py-3 rounded-xl text-sm transition shadow-sm ${
                    loading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-[#000080] hover:bg-[#000060] text-white'
                  }`}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-gray-400">or</span>
                </div>
              </div>

              {/* Demo Access */}
              <button
                onClick={handleDemoLogin}
                className="w-full bg-[#FF9933] hover:bg-[#E88A2D] text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                🔍 Try Demo Without Login
              </button>

              {/* Register link */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => onNavigate('signup')}
                  className="text-xs text-[#000080] hover:underline font-medium"
                >
                  Don't have an account? Register here →
                </button>
              </div>

              {/* BIS Official note */}
              {userType === 'official' && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                  <strong>BIS Officials:</strong> Use your official @bis.gov.in email. Contact IT admin for credentials.
                </div>
              )}
            </div>
          </div>

          {/* Help text */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Protected under Ministry of Consumer Affairs, Food & Public Distribution
          </p>
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
