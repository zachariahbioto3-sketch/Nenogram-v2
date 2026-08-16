import { useEffect } from 'react'
import { useUIStore } from '../../store/uiStore'

const typeStyles = {
  info: { border: 'var(--accent)', color: 'var(--accent)' },
  success: { border: 'var(--success)', color: 'var(--success)' },
  warning: { border: 'var(--warning)', color: 'var(--warning)' },
  error: { border: 'var(--danger)', color: 'var(--danger)' },
}

function NotificationItem({ notification }) {
  const removeNotification = useUIStore((s) => s.removeNotification)
  const style = typeStyles[notification.type] || typeStyles.info

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
      padding: 'var(--space-3) var(--space-4)',
      color: 'var(--text-primary)',
      fontSize: 'var(--text-sm)',
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      boxShadow: 'var(--shadow-md)',
      cursor: 'pointer',
    }} onClick={() => removeNotification(notification.id)}>
      <span style={{ color: style.color, fontWeight: 600 }}>
        {notification.type.toUpperCase()}
      </span>
      <span>{notification.message}</span>
    </div>
  )
}

export default function Notifications() {
  const notifications = useUIStore((s) => s.notifications)

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-6)',
      right: 'var(--space-6)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-2)',
      zIndex: 9999,
      maxWidth: '360px',
    }}>
      {notifications.map((n) => (
        <NotificationItem key={n.id} notification={n} />
      ))}
    </div>
  )
}
