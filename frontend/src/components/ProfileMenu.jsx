import React, { useState, useRef, useEffect } from 'react'

const USER_TYPE_LABELS = {
  msme: { label: 'MSME', icon: '🏭', color: 'text-[#FF9933]' },
  individual: { label: 'Individual', icon: '👤', color: 'text-[#000080]' },
  official: { label: 'BIS Official', icon: '🏛️', color: 'text-[#138808]' },
  guest: { label: 'Guest', icon: '👁️', color: 'text-gray-500' },
}

export default function ProfileMenu({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState(null)
  const menuRef = useRef(null)

  // Load user from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('manakmitra_user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
  }, [open])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    // Clear all user data and chat history
    localStorage.removeItem('manakmitra_user')
    localStorage.removeItem('manakmitra_chat_history')
    setOpen(false)
    onNavigate('landing')
  }

  const handleClearChat = () => {
    localStorage.removeItem('manakmitra_chat_history')
    setOpen(false)
    // Force page reload to reset ChatInterface state
    window.location.reload()
  }

  if (!user) return null

  const typeInfo = USER_TYPE_LABELS[user.userType] || USER_TYPE_LABELS.guest
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'G'

  return (
    <div className="relative" ref={menuRef}>
      {/* Profile Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition"
        title={user.name || 'Guest'}
      >
        <div className="w-8 h-8 bg-white/20 border border-white/30 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">{initials}</span>
        </div>
        <svg
          className={`w-3.5 h-3.5 text-white/70 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50">
          {/* User Info */}
          <div className="p-4 bg-gradient-to-r from-[#000080] to-[#0000a0]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 border-2 border-white/40 rounded-full flex items-center justify-center">
                <span className="text-white text-lg font-bold">{initials}</span>
              </div>
              <div className="min-w-0">
                <p className="text-white font-bold text-sm truncate">{user.name || 'Guest'}</p>
                {user.email && (
                  <p className="text-blue-200 text-xs truncate">{user.email}</p>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-xs ${typeInfo.color} bg-white/20 px-2 py-0.5 rounded-full font-medium`}>
                    {typeInfo.icon} {typeInfo.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleClearChat}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
            >
              <span className="text-base">🗑️</span>
              <div>
                <p className="font-medium">Clear Chat History</p>
                <p className="text-xs text-gray-400">Remove all messages from this session</p>
              </div>
            </button>

            <button
              onClick={() => { setOpen(false); onNavigate('landing') }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition"
            >
              <span className="text-base">🏠</span>
              <div>
                <p className="font-medium">Back to Home</p>
                <p className="text-xs text-gray-400">Return to landing page</p>
              </div>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            {!user.loggedIn ? (
              <button
                onClick={() => { setOpen(false); onNavigate('login') }}
                className="w-full px-4 py-2.5 text-left text-sm text-[#000080] hover:bg-blue-50 flex items-center gap-3 transition font-medium"
              >
                <span className="text-base">🔑</span>
                <div>
                  <p className="font-medium">Sign In / Register</p>
                  <p className="text-xs text-gray-400">Create an account for full access</p>
                </div>
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition"
              >
                <span className="text-base">🚪</span>
                <div>
                  <p className="font-medium">Logout</p>
                  <p className="text-xs text-gray-400">Sign out of your account</p>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
