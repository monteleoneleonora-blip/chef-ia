import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { nanoid } from 'nanoid'

export const useChatStore = create(
  persist(
    (set) => ({
      /** @type {Array<{id:string, role:'user'|'assistant', content:string, ts:string}>} */
      messages: [],
      isOpen: false,

      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { id: nanoid(), role, content, ts: new Date().toISOString() },
          ].slice(-60), // Garde les 60 derniers messages
        })),

      /** Mise à jour du dernier message assistant (streaming) */
      updateLastAssistant: (content) =>
        set((state) => {
          const msgs = [...state.messages]
          const last = msgs[msgs.length - 1]
          if (last?.role === 'assistant') {
            msgs[msgs.length - 1] = { ...last, content }
            return { messages: msgs }
          }
          return state
        }),

      clearHistory: () => set({ messages: [] }),
      setOpen:      (open) => set({ isOpen: open }),
    }),
    {
      name: 'chef-ia-chat',
      partialize: (s) => ({ messages: s.messages }), // on ne persiste pas isOpen
    }
  )
)
