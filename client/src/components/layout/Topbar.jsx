import { useLocation } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { navLinks } from '../../config/nav'

export default function Topbar() {
  const user = useAuthStore((s) => s.user)
  const toggleSidebar = useUIStore((s) => s.toggleSidebar)
  const location = useLocation()

  const currentPage = navLinks.find((l) => {
    if (l.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(l.path)
  })
  const pageTitle = currentPage?.label ?? 'Nenogram'

  return (
    <header style={{
      height: '56px',
      background: 'var(--bg-secondary)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px',
      position: 'sticky',
      top: 0,
      zIndex: 50,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
            <line x1='3' y1='6' x2='21' y2='6'/><line x1='3' y1='12' x2='21' y2='12'/><line x1='3' y1='18' x2='21' y2='18'/>
          </svg>
        </button>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{pageTitle}</span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {user?.is_developer && (
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>
            dev
          </span>
        )}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
            <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 01-3.46 0'/>
          </svg>
        </button>
        <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>
            {user?.username?.[0]?.toUpperCase() ?? '?'}
          </span>
        </div>
      </div>
    </header>
  )
}
