import { create } from 'zustand'

const isMobile = () => window.innerWidth < 768

export const useUIStore = create((set) => ({
  notifications: [],

  addNotification: (message, type = 'info') => set((state) => ({
    notifications: [
      ...state.notifications,
      { id: Date.now(), message, type },
    ]
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id)
  })),

  clearNotifications: () => set({ notifications: [] }),

  sidebarOpen: !isMobile(),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  closeSidebar: () => set({ sidebarOpen: false }),

  activeAccent: '#adc6ff',
  setAccent: (color) => {
    document.documentElement.style.setProperty('--accent', color)
    set({ activeAccent: color })
  },
}))
