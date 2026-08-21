import { useEffect } from 'react'
import { useUIStore } from '../../store/uiStore'

const typeStyles = {
  info:    { border: 'var(--accent)',  color: 'var(--accent)'  },
  success: { border: 'var(--success)', color: 'var(--success)' },
  warning: { border: 'var(--warning)', color: 'var(--warning)' },
  error:   { border: 'var(--danger)',  color: 'var(--danger)'  },
}

function NotificationItem({ notification }) {
  const removeNotification = useUIStore((s) => s.removeNotification)

  // normalise — support both (message, type) and legacy { message, type } object shapes
  const message = typeof notification.message === 'string' ? notification.message : String(notification.message ?? '')
  const type    = notification.type && typeStyles[notification.type] ? notification.type : 'info'
  const style   = typeStyles[type]

  useEffect(() => {
    const timer = setTimeout(() => removeNotification(notification.id), 4000)
    return () => clearTimeout(timer)
  }, [notification.id])

  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid ' + style.border,
      borderLeft: '3px solid ' + style.border,
      borderRadius: 'var(--radius-md)',
      padding: '10px 14px',
      color: 'var(--text-primary)',
      fontSize: '13px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      boxShadow: 'var(--shadow-md)',
      cursor: 'pointer',
      minWidth: '240px',
    }} onClick={() => removeNotification(notification.id)}>
      <span style={{ color: style.color, fontWeight: 700, fontSize: '10px', letterSpacing: '0.06em', flexShrink: 0 }}>
        {type.toUpperCase()}
      </span>
      <span style={{ flex: 1 }}>{message}</span>
    </div>
  )
}

export default function Notifications() {
  const notifications = useUIStore((s) => s.notifications)
  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      zIndex: 9999,
      maxWidth: '360px',
    }}>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  )
}
