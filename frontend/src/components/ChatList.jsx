import React, { useState } from 'react'

const CHATS_KEY = 'manakmitra_chats'
const ACTIVE_CHAT_KEY = 'manakmitra_active_chat'

/**
 * Get all chat sessions from localStorage.
 */
function loadChats() {
  try {
    const stored = localStorage.getItem(CHATS_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/**
 * Save all chat sessions to localStorage.
 */
function saveChats(chats) {
  localStorage.setItem(CHATS_KEY, JSON.stringify(chats))
}

/**
 * Create a new empty chat session.
 */
function createNewChat() {
  const id = 'chat_' + Date.now().toString(36)
  return {
    id,
    title: 'New Chat',
    messages: [],
    createdAt: new Date().toISOString(),
  }
}

/**
 * ChatList — Left sidebar showing all chat sessions.
 * Supports creating new chats, deleting existing ones, and switching between them.
 */
export default function ChatList({ onChatSelect, activeChatId, refreshKey, onWizardOpen }) {
  const [chats, setChats] = useState(() => loadChats())
  const [hoveredId, setHoveredId] = useState(null)

  // Re-load chats when refreshKey changes (triggered by ChatInterface updates)
  React.useEffect(() => {
    setChats(loadChats())
  }, [refreshKey])

  // Reload chats when component re-renders (after ChatInterface updates)
  const refreshChats = () => {
    setChats(loadChats())
  }

  // Create a new chat
  const handleNewChat = () => {
    const newChat = createNewChat()
    const updated = [newChat, ...chats]
    saveChats(updated)
    setChats(updated)
    localStorage.setItem(ACTIVE_CHAT_KEY, newChat.id)
    onChatSelect(newChat.id)
  }

  // Delete a chat
  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    const updated = chats.filter(c => c.id !== chatId)
    saveChats(updated)
    setChats(updated)

    // If deleted the active chat, select the first remaining one
    if (chatId === activeChatId) {
      const nextChat = updated[0] || null
      if (nextChat) {
        localStorage.setItem(ACTIVE_CHAT_KEY, nextChat.id)
        onChatSelect(nextChat.id)
      } else {
        // No chats left — create a new one
        handleNewChat()
      }
    }
  }

  // Select a chat
  const handleSelectChat = (chatId) => {
    localStorage.setItem(ACTIVE_CHAT_KEY, chatId)
    onChatSelect(chatId)
  }

  // Auto-create first chat if none exist
  if (chats.length === 0) {
    const newChat = createNewChat()
    saveChats([newChat])
    setChats([newChat])
    localStorage.setItem(ACTIVE_CHAT_KEY, newChat.id)
    // Don't call onChatSelect here to avoid loop — just render
  }

  const currentChats = loadChats()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b border-gray-300 dark:border-[#2a2d35]">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-[#000080] hover:bg-[#000060] dark:bg-[#1e3a5f] dark:hover:bg-[#2a4a7f] text-white py-2.5 px-3 rounded-xl text-sm font-semibold transition shadow-sm"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {currentChats.map((chat) => {
          const isActive = chat.id === activeChatId
          const isHovered = hoveredId === chat.id
          const messageCount = chat.messages?.length || 0

          return (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat.id)}
              onMouseEnter={() => setHoveredId(chat.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group relative flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition text-sm ${
                isActive
                  ? 'bg-white dark:bg-[#1a1d23] shadow-sm border border-gray-300 dark:border-[#2a2d35] text-[#000080] dark:text-blue-300 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/80 dark:hover:bg-[#1a1d23]/60 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              {/* Chat icon */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={isActive ? 'text-[#000080]' : 'text-gray-400'}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="truncate text-xs font-medium">{chat.title || 'New Chat'}</div>
                {messageCount > 0 && (
                  <div className="text-[10px] text-gray-400">{messageCount} messages</div>
                )}
              </div>

              {/* Delete button (shown on hover) */}
              {isHovered && (
                <button
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                  className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                  title="Delete chat"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer — Quick Stats + Wizard */}
      <div className="border-t border-gray-300 dark:border-[#2a2d35]">
        {/* Certification Wizard shortcut */}
        <div className="p-3">
          <button
            onClick={() => onWizardOpen?.()}
            className="w-full flex items-center gap-2 bg-[#FF9933] dark:bg-[#7c4a1e] hover:bg-[#E88A2D] dark:hover:bg-[#9a5f2a] text-white py-2 px-3 rounded-xl text-xs font-semibold transition"
          >
            <span>📋</span>
            Certification Wizard
          </button>
        </div>
        {/* Quick stats */}
        <div className="px-3 pb-3">
          <div className="bg-white/50 dark:bg-[#1a1d23] rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-400">Standards Indexed</span>
              <span className="font-bold text-[#000080] dark:text-blue-300">23</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-400">Languages</span>
              <span className="font-bold text-[#000080] dark:text-blue-300">20</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-500 dark:text-gray-400">Your Chats</span>
              <span className="font-bold text-[#000080] dark:text-blue-300">{currentChats.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
