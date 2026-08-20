import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useNotifications, useMarkNotificationsRead } from '../../hooks/useSocial'

const IconHeart = () => (
  <svg width="16" height="16" fill="none" stroke="var(--danger)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

const IconComment = () => (
  <svg width="16" height="16" fill="none" stroke="var(--accent)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
  </svg>
)

const IconFollow = () => (
  <svg width="16" height="16" fill="none" stroke="var(--success)" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconBell = () => (
  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
)

const icons = {
  like: <IconHeart />,
  comment: <IconComment />,
  follow: <IconFollow />,
}

const messages = {
  like: 'liked your post',
  comment: 'commented on your post',
  follow: 'started following you',
}

export default function NotificationsPage() {
  const navigate = useNavigate()
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useNotifications()
  const { mutate: markRead } = useMarkNotificationsRead()
  const notifications = data?.notifications ?? []

  useEffect(() => { markRead() }, [])

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }

  return (
    <div style={{ maxWidth: '580px' }}>
      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Notifications</div>
      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
      ) : notifications.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {notifications.map((n) => (
            <div key={n.id} onClick={() => n.post_id && navigate('/hub')} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: n.is_read ? 'var(--bg-secondary)' : 'var(--accent-dim)', border: '1px solid ' + (n.is_read ? 'var(--border)' : 'var(--border-accent)'), borderRadius: 'var(--radius-lg)', cursor: n.post_id ? 'pointer' : 'default', transition: 'var(--transition)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {icons[n.notif_type]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{n.actor_display}</span>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}> {messages[n.notif_type]}</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{timeAgo(n.created_at)}</span>
            </div>
          ))}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}><IconBell /></div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)' }}>No notifications yet</div>
        </div>
      )}
    </div>
  )
}