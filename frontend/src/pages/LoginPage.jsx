import React, { useState } from 'react'

/**
 * LoginPage — Professional government-style login page.
 * Supports MSME, Individual, and BIS Official user types.
 */
export default function LoginPage({ onNavigate }) {
  const [userType, setUserType] = useState('msme')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // For demo: just navigate to app
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

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    {userType === 'official' ? 'Official Email ID' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                      onChange={(e) => setPassword(e.target.value)}
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

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs text-gray-600">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Remember me
                  </label>
                  <button type="button" className="text-xs text-[#000080] hover:underline font-medium">
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#000080] hover:bg-[#000060] text-white font-bold py-3 rounded-xl text-sm transition shadow-sm"
                >
                  Sign In
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
                onClick={() => onNavigate('app')}
                className="w-full bg-[#FF9933] hover:bg-[#E88A2D] text-white font-semibold py-3 rounded-xl text-sm transition"
              >
                🔍 Try Demo Without Login
              </button>

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
