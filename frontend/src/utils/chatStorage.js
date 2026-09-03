/**
 * Per-User Chat Storage — Each registered user gets their own chat list.
 * Storage key format: manakmitra_chats_{userId}
 * Falls back to 'manakmitra_chats' for guests.
 */

const CHATS_PREFIX = 'manakmitra_chats'
const ACTIVE_CHAT_KEY = 'manakmitra_active_chat'
const CURRENT_USER_KEY = 'manakmitra_user'

/**
 * Get the current user's ID from localStorage.
 */
function getCurrentUserId() {
  try {
    const user = JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}')
    return user.id || user.email || 'guest'
  } catch {
    return 'guest'
  }
}

/**
 * Get the localStorage key for the current user's chats.
 */
function getUserChatsKey() {
  return `${CHATS_PREFIX}_${getCurrentUserId()}`
}

/**
 * Get the localStorage key for the current user's active chat.
 */
export function getUserActiveChatKey() {
  return `${ACTIVE_CHAT_KEY}_${getCurrentUserId()}`
}

/**
 * Load all chats for the current user.
 */
export function loadChats() {
  try {
    const key = getUserChatsKey()
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save all chats for the current user.
 */
export function saveChats(chats) {
  const key = getUserChatsKey()
  localStorage.setItem(key, JSON.stringify(chats))
}

/**
 * Get the active chat ID for the current user.
 */
export function getActiveChatId() {
  try {
    return localStorage.getItem(getUserActiveChatKey()) || null
  } catch {
    return null
  }
}

/**
 * Set the active chat ID for the current user.
 */
export function setActiveChatId(chatId) {
  localStorage.setItem(getUserActiveChatKey(), chatId)
}

/**
 * Clear all chats for the current user.
 */
export function clearUserChats() {
  const key = getUserChatsKey()
  localStorage.removeItem(key)
  localStorage.removeItem(getUserActiveChatKey())
}
