import { useAuthStore } from '../../store/authStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
        {user?.username ? 'Welcome back, ' + user.username : 'Welcome back'}
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
        Nenogram V2 - Phase 6 shell active.
      </p>
      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: '16px' }}>
        {['Wallet', 'Marketplace', 'Workspace', 'Hackathon'].map((label) => (
          <div key={label} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>{label.toLowerCase()}</div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>coming soon</div>
          </div>
        ))}
      </div>
    </div>
  )
}
