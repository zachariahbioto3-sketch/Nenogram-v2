import { NavLink } from 'react-router-dom'

const icons = {
  grid:   (<svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='3' y='3' width='7' height='7' rx='1.5'/><rect x='14' y='3' width='7' height='7' rx='1.5'/><rect x='3' y='14' width='7' height='7' rx='1.5'/><rect x='14' y='14' width='7' height='7' rx='1.5'/></svg>),
  hub:    (<svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'/></svg>),
  store:  (<svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>),
  nano:   (<svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>),
  wallet: (<svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M16 12h2'/></svg>),
}

const mobileLinks = [
  { label: 'Home',   path: '/',            icon: 'grid',   exact: true },
  { label: 'Hub',    path: '/hub',         icon: 'hub' },
  { label: 'Nano',   path: '/nano',        icon: 'nano' },
  { label: 'Market', path: '/marketplace', icon: 'store' },
  { label: 'Wallet', path: '/wallet',      icon: 'wallet' },
]

export default function MobileNav() {
  return (
    <>
      <style>{`
        .mobile-nav { display: none; }
        @media (max-width: 768px) {
          .mobile-nav { display: flex !important; position: fixed; bottom: 0; left: 0; right: 0; background: var(--sidebar-bg); border-top: 1px solid rgba(255,255,255,0.07); padding: 8px 0 max(8px, env(safe-area-inset-bottom)); z-index: 200; justify-content: space-around; align-items: center; }
        }
        .mobile-nav a { display: flex; flex-direction: column; align-items: center; gap: 3px; text-decoration: none; color: rgba(255,255,255,0.4); transition: color 0.15s; flex: 1; padding: 4px 0; font-size: 10px; font-family: var(--font-sans); font-weight: 500; }
        .mobile-nav a[aria-current='page'] { color: #ffffff; }
      `}</style>
      <nav className='mobile-nav'>
        {mobileLinks.map(link => (
          <NavLink key={link.path} to={link.path} end={link.exact}>{icons[link.icon]}{link.label}</NavLink>
        ))}
      </nav>
    </>
  )
}
