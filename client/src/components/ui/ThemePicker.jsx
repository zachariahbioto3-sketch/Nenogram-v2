import { useUIStore } from '../../store/uiStore'
import { THEMES } from '../../config/themes'

export default function ThemePicker() {
  const { theme, setTheme } = useUIStore()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontWeight: 500 }}>
        Theme
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            title={t.label}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              background: 'none',
              border: theme === t.id ? '2px solid var(--accent-2)' : '2px solid transparent',
              borderRadius: 'var(--radius-md)',
              padding: '6px 8px',
              cursor: 'pointer',
              transition: 'border-color var(--transition)',
            }}
          >
            <div style={{ display: 'flex', gap: 3 }}>
              {t.preview.map((color, i) => (
                <span key={i} style={{ width: 14, height: 14, borderRadius: '50%', background: color }} />
              ))}
            </div>
            <span style={{
              fontSize: 'var(--text-xs)',
              color: theme === t.id ? 'var(--accent-2)' : 'var(--text-muted)',
              fontFamily: 'var(--font-sans)',
            }}>
              {t.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
