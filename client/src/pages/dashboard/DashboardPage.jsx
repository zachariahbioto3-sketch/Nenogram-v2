import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: accent ? 'var(--accent)' : 'var(--bg-secondary)',
    border: accent ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    boxShadow: accent ? '0 4px 20px rgba(232,160,32,0.25)' : 'var(--shadow-sm)',
  }}>
    <span style={{ fontSize: '12px', fontWeight: 500, color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </span>
    <span style={{ fontSize: '26px', fontWeight: 600, color: accent ? '#ffffff' : 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
      {value}
    </span>
    {sub && (
      <span style={{ fontSize: '12px', color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}>
        {sub}
      </span>
    )}
  </div>
)

const QuickLink = ({ label, desc, icon, path, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      cursor: 'pointer',
      transition: 'border-color var(--transition), box-shadow var(--transition)',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
  >
    <div style={{
      width: '40px', height: '40px',
      background: 'var(--accent-dim)',
      borderRadius: '12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      color: 'var(--accent)',
    }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
    </div>
    <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
      <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
        <polyline points='9 18 15 12 9 6'/>
      </svg>
    </div>
  </div>
)

const ActivityItem = ({ label, time, tag, tagColor }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '12px 0',
    borderBottom: '1px solid var(--border)',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: tagColor ?? 'var(--accent)', flexShrink: 0 }} />
      <span style={{ fontSize: '13px', color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <span style={{
        fontSize: '11px', fontWeight: 500,
        background: tagColor ? tagColor + '18' : 'var(--accent-dim)',
        color: tagColor ?? 'var(--accent)',
        border: '1px solid ' + (tagColor ? tagColor + '40' : 'var(--border-accent)'),
        borderRadius: 'var(--radius-full)',
        padding: '2px 9px',
      }}>{tag}</span>
      <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{time}</span>
    </div>
  </div>
)

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            {greeting}{user?.username ? ', ' + user.username : ''}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Here is what is happening on your account today.
          </p>
        </div>
        {user?.is_developer && (
          <span style={{
            fontSize: '11px', fontFamily: 'var(--font-mono)',
            color: 'var(--accent)', background: 'var(--accent-dim)',
            border: '1px solid var(--border-accent)',
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            fontWeight: 600,
          }}>
            dev mode
          </span>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard label='Wallet Balance' value='KSh 0.00' sub='Real balance' accent />
        <StatCard label='NenoCoin' value='0 NC' sub='Platform currency' />
        <StatCard label='Active Gigs' value='0' sub='In progress' />
        <StatCard label='Hackathons' value='0' sub='Joined' />
      </div>

      {/* Quick links + Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>

        {/* Quick links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Quick access
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <QuickLink
              label='Marketplace'
              desc='Browse gigs and post work'
              onClick={() => navigate('/marketplace')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>}
            />
            <QuickLink
              label='Workspace'
              desc='Open your browser IDE'
              onClick={() => navigate('/workspace')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/></svg>}
            />
            <QuickLink
              label='Hackathons'
              desc='Compete and win prizes'
              onClick={() => navigate('/hackathon')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M6 9H4.5a2.5 2.5 0 000 5H6'/><path d='M18 9h1.5a2.5 2.5 0 010 5H18'/><path d='M8 9h8'/><path d='M8 15h8'/><path d='M12 3v18'/></svg>}
            />
            <QuickLink
              label='Nano Editor'
              desc='Write and collaborate on docs'
              onClick={() => navigate('/nano')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>}
            />
            <QuickLink
              label='Wallet'
              desc='Top up, withdraw, transfer'
              onClick={() => navigate('/wallet')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M16 12h2'/></svg>}
            />
          </div>
        </div>

        {/* Recent activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Recent activity
          </span>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: '4px 20px 8px',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <ActivityItem label='Account created' time='just now' tag='auth' tagColor='#4a8fe0' />
            <ActivityItem label='Wallet initialized' time='just now' tag='wallet' tagColor='#2d9e6b' />
            <ActivityItem label='Profile pending setup' time='now' tag='profile' />
            <div style={{ padding: '14px 0 4px', textAlign: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                Activity will appear here as you use the platform.
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Platform overview strip */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 'var(--shadow-sm)',
        gap: '12px',
        flexWrap: 'wrap',
      }}>
        {[
          { label: 'Platform', value: 'Nenogram V2' },
          { label: 'Stack', value: 'React + Django' },
          { label: 'Currency', value: 'KSh · NC' },
          { label: 'Payments', value: 'M-Pesa · Stripe' },
          { label: 'Status', value: 'Active', ok: true },
        ].map(({ label, value, ok }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            <span style={{
              fontSize: '13px', fontWeight: 600,
              color: ok ? 'var(--success)' : 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
            }}>{value}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
