export default function Badge({ children, variant = 'default', dot = false, style = {} }) {
  const variants = {
    default:   { background: 'var(--bg-tertiary)',  color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    accent:    { background: 'var(--accent-dim)',   color: 'var(--accent-1)',        border: '1px solid var(--border-accent)' },
    success:   { background: 'rgba(45,158,107,0.12)', color: 'var(--success)',       border: '1px solid rgba(45,158,107,0.30)' },
    warning:   { background: 'rgba(232,160,32,0.12)', color: 'var(--warning)',       border: '1px solid rgba(232,160,32,0.30)' },
    danger:    { background: 'rgba(224,80,80,0.12)',  color: 'var(--danger)',        border: '1px solid rgba(224,80,80,0.30)' },
    developer: { background: 'var(--accent-dim)',   color: 'var(--accent-2)',        border: '1px solid var(--border-accent)', fontFamily: 'var(--font-mono)' },
  }
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '5px',
      padding: '3px 10px',
      borderRadius: 'var(--radius-full)',
      fontSize: 'var(--text-xs)',
      fontWeight: 500,
      ...variants[variant],
      ...style,
    }}>
      {dot && (
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: 'currentColor',
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  )
}
