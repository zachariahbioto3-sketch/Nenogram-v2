import { Outlet } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { useUIStore } from '../../store/uiStore'

export default function AppLayout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const closeSidebar = useUIStore((s) => s.closeSidebar)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile) return
      closeSidebar()
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [closeSidebar])

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', overflow: 'hidden', position: 'relative' }}>

      {/* Backdrop — mobile only */}
      {isMobile && sidebarOpen && (
        <div onClick={closeSidebar} style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 99,
        }} />
      )}

      <Sidebar isMobile={isMobile} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <Topbar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '16px' : '28px',
        }}>
          <Outlet />
        </main>
      </div>

    </div>
  )
}
