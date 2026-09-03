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
export default function ChatList({ onChatSelect, activeChatId }) {
  const [chats, setChats] = useState(() => loadChats())
  const [hoveredId, setHoveredId] = useState(null)

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
    <div className="flex flex-col h-full bg-[#f7f8fa]">
      {/* Header */}
      <div className="p-3 border-b border-gray-200">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-[#000080] hover:bg-[#000060] text-white py-2.5 px-3 rounded-xl text-sm font-semibold transition shadow-sm"
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
                  ? 'bg-white shadow-sm border border-gray-200 text-[#000080] font-medium'
                  : 'text-gray-600 hover:bg-white/60 hover:text-gray-800'
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

      {/* Footer info */}
      <div className="p-3 border-t border-gray-200">
        <div className="text-[10px] text-gray-400 text-center">
          {currentChats.length} chat{currentChats.length !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  )
}
