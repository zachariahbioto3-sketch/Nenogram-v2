export default function Avatar({ src, name = '', size = 36, style = {} }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  const colors = ['#26658C','#1e8c55','#6b35b8','#b83560','#a87d10','#e07020']
  const color = colors[(name.charCodeAt(0) || 0) % colors.length]

  return src ? (
    <img
      src={src}
      alt={name}
      style={{
        width: size, height: size,
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid var(--border)',
        flexShrink: 0,
        ...style,
      }}
    />
  ) : (
    <div style={{
      width: size, height: size,
      borderRadius: '50%',
      background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.36,
      fontWeight: 600,
      color: '#fff',
      flexShrink: 0,
      border: '2px solid var(--border)',
      fontFamily: 'var(--font-sans)',
      userSelect: 'none',
      ...style,
    }}>
      {initials || '?'}
    </div>
  )
}
