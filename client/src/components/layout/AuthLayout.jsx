export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-6)' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '52px', height: '52px', background: 'var(--accent)', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', boxShadow: '0 8px 24px rgba(38,101,140,0.35)' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '22px', color: '#ffffff', letterSpacing: '-1px' }}>N</span>
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Nenogram</div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px', margin: '0 0 4px' }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', margin: 0 }}>{subtitle}</p>}
        </div>
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-8)', boxShadow: 'var(--shadow-md)' }}>{children}</div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>Built in Kenya 🇰🇪 · React + Django · M-Pesa Powered</p>
      </div>
    </div>
  )
}
