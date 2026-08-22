import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useLogout } from '../../hooks/useAuth'
import { navLinks } from '../../config/nav'

const icons = {
  grid:     (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7' rx='1.5'/><rect x='14' y='3' width='7' height='7' rx='1.5'/><rect x='3' y='14' width='7' height='7' rx='1.5'/><rect x='14' y='14' width='7' height='7' rx='1.5'/></svg>),
  hub:      (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'/></svg>),
  store:    (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>),
  wallet:   (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M16 12h2'/></svg>),
  nano:     (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/><polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/></svg>),
  trophy:   (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M6 9H4.5a2.5 2.5 0 000 5H6'/><path d='M18 9h1.5a2.5 2.5 0 010 5H18'/><path d='M8 9h8'/><path d='M8 15h8'/><path d='M12 3v18'/></svg>),
  user:     (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><circle cx='12' cy='8' r='4'/><path d='M4 20c0-4 3.6-7 8-7s8 3 8 7'/></svg>),
  settings: (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><circle cx='12' cy='12' r='3'/><path d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z'/></svg>),
}

const tooltipStyle = {
  position: 'absolute', left: 'calc(100% + 12px)', top: '50%', transform: 'translateY(-50%)',
  background: '#1a1a1a', color: '#ffffff', fontSize: '12px', fontWeight: 500,
  padding: '5px 10px', borderRadius: '8px', whiteSpace: 'nowrap',
  pointerEvents: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 200,
}
const tooltipArrow = {
  position: 'absolute', left: '-4px', top: '50%', transform: 'translateY(-50%)',
  width: '8px', height: '8px', background: '#1a1a1a', borderRadius: '2px', rotate: '45deg',
}
const LogoutIcon = () => (<svg width='20' height='20' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4'/><polyline points='16 17 21 12 16 7'/><line x1='21' y1='12' x2='9' y2='12'/></svg>)
const LogoMark = () => (<div style={{ width: '38px', height: '38px', background: '#ffffff', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '16px', color: '#111111', letterSpacing: '-1px' }}>N</span></div>)

export default function Sidebar() {
  const user = useAuthStore((s) => s.user)
  const { mutate: logout } = useLogout()
  const navigate = useNavigate()
  const profilePath = user?.username ? '/profile/' + user.username : '/profile'
  const handleLogout = () => { logout(); navigate('/login') }
  return (
    <>
      <style>{`
        .sidebar-link-wrap { position: relative; width: 100%; display: flex; justify-content: center; }
        .sidebar-tooltip { display: none; }
        .sidebar-link-wrap:hover .sidebar-tooltip { display: block; }
        .sidebar-btn-wrap { position: relative; display: flex; justify-content: center; }
        .sidebar-btn-wrap:hover .sidebar-tooltip { display: block; }
      `}</style>
      <aside style={{ position: 'fixed', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '64px', background: 'var(--sidebar-bg)', borderRadius: '24px', padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', zIndex: 100, boxShadow: '0 8px 32px rgba(0,0,0,0.25)' }}>
        <div style={{ marginBottom: '16px' }}><LogoMark /></div>
        <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flex: 1, width: '100%' }}>
          {navLinks.map((link) => (
            link.label === 'Profile'
              ? <SidebarLink key='Profile' to={profilePath} icon={icons['user']} label='Profile' />
              : <SidebarLink key={link.label} to={link.path} icon={icons[link.icon]} label={link.label} exact={link.path === '/'} />
          ))}
        </nav>
        <div style={{ marginTop: '16px', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <div className='sidebar-btn-wrap'>
            <button onClick={handleLogout} style={{ width: '44px', height: '44px', background: 'transparent', border: 'none', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.35)', transition: 'color var(--transition), background var(--transition)' }} onMouseEnter={(e) => { e.currentTarget.style.color = '#e05050'; e.currentTarget.style.background = 'rgba(224,80,80,0.12)' }} onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.background = 'transparent' }}><LogoutIcon /></button>
            <div className='sidebar-tooltip' style={tooltipStyle}><div style={tooltipArrow} />Sign out</div>
          </div>
        </div>
      </aside>
    </>
  )
}

function SidebarLink({ to, icon, label, exact }) {
  return (
    <div className='sidebar-link-wrap'>
      <NavLink to={to} end={exact} style={({ isActive }) => ({ width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isActive ? '#111111' : 'rgba(255,255,255,0.45)', background: isActive ? '#ffffff' : 'transparent', transition: 'background var(--transition), color var(--transition)', textDecoration: 'none', flexShrink: 0 })} onMouseEnter={(e) => { if (e.currentTarget.getAttribute('aria-current') !== 'page') { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)' } }} onMouseLeave={(e) => { if (e.currentTarget.getAttribute('aria-current') !== 'page') { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.45)' } }}>{icon}</NavLink>
      <div className='sidebar-tooltip' style={tooltipStyle}><div style={tooltipArrow} />{label}</div>
    </div>
  )
}
