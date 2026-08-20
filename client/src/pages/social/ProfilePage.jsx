import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useUserPosts, useFollowUser } from '../../hooks/useSocial'

const IconHeart = ({ filled }) => (
  <svg width="12" height="12" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const isOwn = user?.username === username
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useUserPosts(username)
  const { mutate: followUser } = useFollowUser()
  const posts = data?.posts ?? []
  const profile = posts[0] ? { username: posts[0].author_username, display: posts[0].author_display, is_following: posts[0].is_following } : null

  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }

  return (
    <div style={{ maxWidth: '580px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '16px', padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>Back</button>
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'var(--accent)' }}>{username[0].toUpperCase()}</span>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>{profile?.display || username}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{username}</div>
        </div>
        {!isOwn && (
          <button onClick={() => followUser(username)} style={{ padding: '7px 18px', background: profile?.is_following ? 'var(--accent-dim)' : 'var(--accent)', border: profile?.is_following ? '1px solid var(--border-accent)' : 'none', borderRadius: 'var(--radius-md)', color: profile?.is_following ? 'var(--accent)' : '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
            {profile?.is_following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '12px' }}>posts ({data?.pages?.[0]?.count ?? 0})</div>
      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
      ) : posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map((post) => (
            <div key={post.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
              <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, marginBottom: '10px' }}>{post.content}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{timeAgo(post.created_at)}</span>
                <span style={{ fontSize: '12px', color: post.is_liked ? 'var(--danger)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <IconHeart filled={post.is_liked} /> {post.like_count}
                </span>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>No posts yet.</div>
      )}
    </div>
  )
}