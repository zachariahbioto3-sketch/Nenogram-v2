export default function EmptyState({ icon, title, description, action, actionLabel }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', color: 'var(--accent)' }}>{icon}</div>
      <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>{title}</div>
      {description && <p style={{ fontSize: '13px', color: 'var(--text-muted)', maxWidth: '300px', lineHeight: 1.6, margin: '0 0 20px' }}>{description}</p>}
      {action && <button onClick={action} style={{ padding: '9px 22px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>{actionLabel}</button>}
    </div>
  )
}
