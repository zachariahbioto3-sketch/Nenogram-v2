export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(224,80,80,0.08)', border: '1px solid rgba(224,80,80,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px', color: 'var(--danger)' }}>
        <svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><line x1='12' y1='8' x2='12' y2='12'/><line x1='12' y1='16' x2='12.01' y2='16'/></svg>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Oops</div>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 18px', maxWidth: '260px', lineHeight: 1.6 }}>{message}</p>
      {onRetry && <button onClick={onRetry} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Try again</button>}
    </div>
  )
}
