export default function Button({ children, variant = 'primary', loading, fullWidth, ...props }) {
  const styles = {
    primary: {
      background: 'var(--accent)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0 2px 8px rgba(232,160,32,0.30)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    },
    danger: {
      background: 'transparent',
      color: 'var(--danger)',
      border: '1px solid var(--danger)',
    },
  }
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      style={{
        ...styles[variant],
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-3) var(--space-6)',
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        cursor: loading || props.disabled ? 'not-allowed' : 'pointer',
        opacity: loading || props.disabled ? 0.6 : 1,
        transition: 'opacity var(--transition), box-shadow var(--transition)',
        width: fullWidth ? '100%' : 'auto',
        fontFamily: 'var(--font-sans)',
        ...props.style,
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}
