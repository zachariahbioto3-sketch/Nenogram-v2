export default function Card({ children, variant = 'default', padding = true, style = {}, onClick }) {
  const variants = {
    default:  { background: 'var(--bg-secondary)', border: '1px solid var(--border)' },
    elevated: { background: 'var(--bg-elevated)',  border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)' },
    bordered: { background: 'transparent',         border: '1px solid var(--border-strong)' },
    accent:   { background: 'var(--accent-dim)',   border: '1px solid var(--border-accent)' },
  }
  return (
    <div
      onClick={onClick}
      style={{
        ...variants[variant],
        borderRadius: 'var(--radius-lg)',
        padding: padding ? 'var(--space-6)' : 0,
        transition: 'box-shadow var(--transition)',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  )
}
