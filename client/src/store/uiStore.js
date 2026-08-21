import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_THEME } from '../config/themes'

const applyTheme = (themeId) => {
  document.documentElement.setAttribute('data-theme', themeId)
}

export const useUIStore = create(persist(
  (set, get) => ({
    notifications: [],
    modals: {},
    theme: DEFAULT_THEME,

    setTheme: (themeId) => {
      applyTheme(themeId)
      set({ theme: themeId })
    },

    initTheme: () => applyTheme(get().theme),

    addNotification: (notification) => {
      const id = Date.now()
      set((s) => ({ notifications: [...s.notifications, { id, ...notification }] }))
      if (notification.duration !== 0) {
        setTimeout(() => get().removeNotification(id), notification.duration || 4000)
      }
      return id
    },

    removeNotification: (id) =>
      set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),

    openModal: (key, data = {}) =>
      set((s) => ({ modals: { ...s.modals, [key]: { open: true, data } } })),

    closeModal: (key) =>
      set((s) => ({ modals: { ...s.modals, [key]: { open: false, data: {} } } })),
  }),
  { name: 'nenogram-ui', partialize: (s) => ({ theme: s.theme }) }
))
