/**
 * Auth Utility — server-side authentication via /api/auth/* (JWT + bcrypt).
 *
 * Passwords are bcrypt-hashed server-side (backend/auth.py); sessions are
 * signed JWTs stored in localStorage. The current session profile lives in
 * 'manakmitra_user', the token in 'manakmitra_token'.
 *
 * All functions are async and return the same { success, user?, error? }
 * shape the old localStorage implementation used.
 */
import apiFetch from './apiFetch'

const TOKEN_KEY = 'manakmitra_token'
const CURRENT_USER_KEY = 'manakmitra_user'
const LEGACY_USERS_KEY = 'manakmitra_users'

/** POST JSON to the backend; normalize errors to { success:false, error }. */
async function postJSON(url, body) {
  let res
  try {
    res = await apiFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    return { success: false, error: 'Cannot reach the server. Please try again.' }
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* empty body */
  }

  if (!res.ok) {
    // FastAPI errors: { detail: string } or { detail: [ { msg }, ... ] } (422)
    let detail = data && data.detail
    if (Array.isArray(detail)) detail = detail.map((d) => d.msg).join('; ')
    return { success: false, error: detail || `Registration failed (HTTP ${res.status}).` }
  }

  return { success: true, data }
}

/** Persist session (JWT + profile) from a backend auth response. */
function storeSession(data) {
  const u = data.user || {}
  const sessionUser = {
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || '',
    userType: u.user_type || 'individual',
    organization: u.organization || '',
    state: u.state || '',
    loggedIn: true,
  }
  localStorage.setItem(TOKEN_KEY, data.token)
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))
  return sessionUser
}

/** Current JWT (null for guests / logged out). */
export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Register a new user on the backend (bcrypt-hashed, returns JWT session).
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function register({
  name,
  email,
  phone,
  password,
  userType,
  organization,
  gstNumber,
  state,
  district,
}) {
  // Client-side validation mirrors the backend so users fail fast.
  if (!name || !name.trim()) return { success: false, error: 'Full name is required.' }
  if (!email || !email.trim()) return { success: false, error: 'Email address is required.' }
  if (!password || password.length < 8) {
    return { success: false, error: 'Password must be at least 8 characters.' }
  }

  const { success, data, error } = await postJSON('/api/auth/register', {
    name: name.trim(),
    email: email.trim(),
    password,
    phone: phone || '',
    userType: userType || 'individual',
    organization: organization || '',
    gstNumber: gstNumber || '',
    state: state || '',
    district: district || '',
  })
  if (!success) return { success: false, error }

  const user = storeSession(data)
  return { success: true, user }
}

/**
 * Login with email and password (verified against bcrypt hashes).
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function login(email, password) {
  if (!email || !email.trim()) return { success: false, error: 'Email address is required.' }
  if (!password) return { success: false, error: 'Password is required.' }

  const { success, data, error } = await postJSON('/api/auth/login', {
    email: email.trim(),
    password,
  })
  if (!success) return { success: false, error }

  const user = storeSession(data)
  return { success: true, user }
}

/**
 * Logout — clears session token, current user, and legacy chat key.
 */
export function logout() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(CURRENT_USER_KEY)
  // Clear the old shared chat key (legacy cleanup)
  localStorage.removeItem('manakmitra_chat_history')
}

/**
 * Set guest user (for demo without login).
 */
export function setGuest() {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({
    id: 'guest',
    name: 'Guest',
    email: '',
    userType: 'guest',
    loggedIn: false,
  }))
}

/**
 * Get current logged-in user (session snapshot; guests have loggedIn:false).
 * @returns {object|null}
 */
export function getCurrentUser() {
  try {
    const stored = localStorage.getItem(CURRENT_USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

/**
 * Check if an account exists for the given email.
 * Kept for API compatibility: registration now lives on the server, so this
 * only reflects pre-existing legacy localStorage accounts.
 * @returns {boolean}
 */
export function isRegistered(email) {
  if (!email) return false
  try {
    const stored = localStorage.getItem(LEGACY_USERS_KEY)
    const users = stored ? JSON.parse(stored) : []
    return users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
  } catch {
    return false
  }
}
