import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useUIStore } from '../../store/uiStore'
import { useLogout } from '../../hooks/useAuth'
import { navLinks, bottomLinks } from '../../config/nav'

const icons = {
  grid:     (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7' rx='1'/><rect x='14' y='3' width='7' height='7' rx='1'/><rect x='3' y='14' width='7' height='7' rx='1'/><rect x='14' y='14' width='7' height='7' rx='1'/></svg>),
  hub:      (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'/></svg>),
  store:    (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>),
  wallet:   (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M16 12h2'/></svg>),
  nano:     (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/><polyline points='10 9 9 9 8 9'/></svg>),
  code:     (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>),
  user:     (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 3.6-7 8-7s8 3 8 7'/></svg>),
  settings: (<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'/></svg>),
}

export default function Sidebar({ isMobile }) {
  const user = useAuthStore((s) => s.user)
  const sidebarOpen = useUIStore((s) => s.sidebarOpen)
  const closeSidebar = useUIStore((s) => s.closeSidebar)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }
  const handleNavClick = () => { if (isMobile) closeSidebar() }
  const profilePath = user?.username ? '/profile/' + user.username : '/profile'

  const sidebarStyle = isMobile ? {
    position: 'fixed', top: 0, left: 0, height: '100vh', width: '220px',
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform var(--transition-slow)',
    zIndex: 100, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
  } : {
    width: sidebarOpen ? '220px' : '0', minWidth: sidebarOpen ? '220px' : '0',
    overflow: 'hidden', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column',
    transition: 'min-width var(--transition-slow), width var(--transition-slow)',
    height: '100vh', position: 'sticky', top: 0,
  }

  return (
    <aside style={sidebarStyle}>
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '16px', color: 'var(--accent)', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>nenogram</span>
      </div>
      <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
        {navLinks.map((link) => (
          link.label === 'Profile'
            ? <NavLink key={link.label} to={profilePath} onClick={handleNavClick} style={({ isActive }) => navStyle(isActive)}>
                <span style={{ flexShrink: 0 }}>{icons[link.icon]}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
              </NavLink>
            : <NavLink key={link.label} to={link.path} end={link.path === '/'} onClick={handleNavClick} style={({ isActive }) => navStyle(isActive)}>
                <span style={{ flexShrink: 0 }}>{icons[link.icon]}</span>
                <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
              </NavLink>
        ))}
      </nav>
      <div style={{ padding: '12px 10px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '6px', flexShrink: 0 }}>
        {bottomLinks.map((link) => (
          <NavLink key={link.label} to={link.path} onClick={handleNavClick} style={({ isActive }) => navStyle(isActive)}>
            <span style={{ flexShrink: 0 }}>{icons[link.icon]}</span>
            <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>
          </NavLink>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>{user?.username?.[0]?.toUpperCase() ?? '?'}</span>
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.username ?? 'User'}</div>
            {user?.is_developer && <div style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>developer</div>}
          </div>
        </div>
        <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Sign out</button>
      </div>
    </aside>
  )
}

function navStyle(isActive) {
  return {
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 10px', borderRadius: 'var(--radius-md)',
    fontSize: '14px', fontWeight: isActive ? 600 : 400,
    color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
    background: isActive ? 'var(--accent-dim)' : 'transparent',
    textDecoration: 'none', transition: 'var(--transition)',
  }
}
