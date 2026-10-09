import { create } from 'zustand'
import type { Conversation, Message } from '../types'
import { conversations } from '../mocks/conversations'
import { CURRENT_USER_ID } from '../mocks/users'

let mid = 1000
const nextMid = () => `ms${++mid}`

interface ChatState {
  conversations: Conversation[]
  activeId: string
  replyTo: Message | null
  setActive: (id: string) => void
  setReplyTo: (message: Message | null) => void
  sendMessage: (body: string) => void
  toggleReaction: (conversationId: string, messageId: string, emoji: string) => void
  markConversationRead: (conversationId: string) => void
}

export const useChatStore = create<ChatState>()((set) => ({
  conversations,
  activeId: 'cv1',
  replyTo: null,

  setActive: (id) =>
    set((s) => ({
      activeId: id,
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    })),

  setReplyTo: (message) => set({ replyTo: message }),

  sendMessage: (body) => {
    const trimmed = body.trim()
    if (!trimmed) return
    const message: Message = {
      id: nextMid(),
      senderId: CURRENT_USER_ID,
      body: trimmed,
      createdAt: new Date().toISOString(),
      replyToId: undefined,
      reactions: [],
    }
    set((s) => ({
      replyTo: null,
      conversations: s.conversations.map((c) =>
        c.id === s.activeId
          ? {
              ...c,
              messages: [
                ...c.messages,
                s.replyTo ? { ...message, replyToId: s.replyTo.id } : message,
              ],
            }
          : c
      ),
    }))
  },

  toggleReaction: (conversationId, messageId, emoji) =>
    set((s) => ({
      conversations: s.conversations.map((c) => {
        if (c.id !== conversationId) return c
        return {
          ...c,
          messages: c.messages.map((m) => {
            if (m.id !== messageId) return m
            const existing = m.reactions.find((r) => r.emoji === emoji)
            if (!existing) return { ...m, reactions: [...m.reactions, { emoji, userIds: [CURRENT_USER_ID] }] }
            const mine = existing.userIds.includes(CURRENT_USER_ID)
            const userIds = mine
              ? existing.userIds.filter((u) => u !== CURRENT_USER_ID)
              : [...existing.userIds, CURRENT_USER_ID]
            return {
              ...m,
              reactions: m.reactions
                .map((r) => (r.emoji === emoji ? { ...r, userIds } : r))
                .filter((r) => r.userIds.length > 0),
            }
          }),
        }
      }),
    })),

  markConversationRead: (conversationId) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unread: 0 } : c)),
    })),
}))
