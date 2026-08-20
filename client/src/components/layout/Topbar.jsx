import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { navLinks } from '../../config/nav'
import { useUnreadCount } from '../../hooks/useSocial'

export default function Topbar() {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const navigate = useNavigate()
  const { data: unread } = useUnreadCount()
  const unreadCount = unread?.count ?? 0

  const currentPage = navLinks.find((l) => {
    if (l.path === '/') return location.pathname === '/'
    return location.pathname.startsWith(l.path)
  })
  const pageTitle = currentPage?.label ?? 'Nenogram'

  return (
    <header style={{ height: '64px', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px 0 4px', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontSize: '17px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
        {pageTitle}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '0 14px', height: '36px', gap: '8px', width: '220px', boxShadow: 'var(--shadow-sm)' }}>
          <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24' style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
            <circle cx='11' cy='11' r='8'/><line x1='21' y1='21' x2='16.65' y2='16.65'/>
          </svg>
          <input placeholder='Search...' style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px', color: 'var(--text-primary)', width: '100%', fontFamily: 'var(--font-sans)' }} />
        </div>

        <button onClick={() => navigate('/notifications')} style={{ width: '36px', height: '36px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-secondary)', boxShadow: 'var(--shadow-sm)', position: 'relative' }}>
          <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
            <path d='M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9'/><path d='M13.73 21a2 2 0 01-3.46 0'/>
          </svg>
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px', background: 'var(--danger)', borderRadius: '50%', fontSize: '9px', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '4px 12px 4px 4px', cursor: 'pointer', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: '#ffffff', fontWeight: 700 }}>{user?.username?.[0]?.toUpperCase() ?? '?'}</span>
          </div>
          <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>{user?.username ?? 'User'}</span>
          <svg width='12' height='12' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24' style={{ color: 'var(--text-muted)' }}>
            <polyline points='6 9 12 15 18 9'/>
          </svg>
        </div>
      </div>
    </header>
  )
}