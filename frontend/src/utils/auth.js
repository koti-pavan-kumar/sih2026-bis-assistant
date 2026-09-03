/**
 * Auth Utility — Manages user registration and login via localStorage.
 * 
 * Stores registered users in 'manakmitra_users' as an array of user objects.
 * Current logged-in user stored in 'manakmitra_user'.
 */

const USERS_KEY = 'manakmitra_users'
const CURRENT_USER_KEY = 'manakmitra_user'

// Simple hash for password (not cryptographically secure — acceptable for hackathon demo)
function simpleHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return 'h_' + Math.abs(hash).toString(36)
}

/**
 * Get all registered users from localStorage.
 */
function getUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save users array to localStorage.
 */
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/**
 * Register a new user.
 * @returns {{ success: boolean, error?: string }}
 */
export function register({ name, email, phone, password, userType, organization, gstNumber, state, district }) {
  const users = getUsers()

  // Validation
  if (!name || !name.trim()) return { success: false, error: 'Full name is required.' }
  if (!email || !email.trim()) return { success: false, error: 'Email address is required.' }
  if (!password || password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' }

  // Check if email already registered
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase())
  if (existing) return { success: false, error: 'An account with this email already exists. Please sign in instead.' }

  // Create user object
  const newUser = {
    id: 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone || '',
    passwordHash: simpleHash(password),
    userType: userType || 'individual',
    organization: organization || '',
    gstNumber: gstNumber || '',
    state: state || '',
    district: district || '',
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  return { success: true }
}

/**
 * Login with email and password.
 * @returns {{ success: boolean, user?: object, error?: string }}
 */
export function login(email, password) {
  if (!email || !email.trim()) return { success: false, error: 'Email address is required.' }
  if (!password) return { success: false, error: 'Password is required.' }

  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase())

  if (!user) {
    return { success: false, error: 'No account found with this email. Please register first.' }
  }

  if (user.passwordHash !== simpleHash(password)) {
    return { success: false, error: 'Incorrect password. Please try again.' }
  }

  // Login successful — store current user (without password hash)
  const sessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    userType: user.userType,
    organization: user.organization,
    state: user.state,
    loggedIn: true,
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))

  return { success: true, user: sessionUser }
}

/**
 * Logout — clears current user and chat history.
 */
export function logout() {
  // Clear user session (chats are per-user and stay in storage)
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
 * Get current logged-in user.
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
 * Check if a user is registered with the given email.
 * @returns {boolean}
 */
export function isRegistered(email) {
  if (!email) return false
  const users = getUsers()
  return users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())
}
