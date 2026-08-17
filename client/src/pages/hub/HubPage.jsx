import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useFeed, useExplore, useCreatePost, useDeletePost, useLikePost } from '../../hooks/useSocial'

function PostCard({ post, onLike, onDelete }) {
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '12px' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{post.author_username[0].toUpperCase()}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{post.author_display || post.author_username}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{post.author_username}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{timeAgo(post.created_at)}</span>
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, marginBottom: '10px', wordBreak: 'break-word' }}>{post.content}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => onLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: post.is_liked ? 'var(--danger)' : 'var(--text-muted)', fontSize: '12px', padding: '2px 0' }}>
            <svg width='14' height='14' fill={post.is_liked ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'/></svg>
            {post.like_count}
          </button>
          {post.is_own && (
            <button onClick={() => onDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', marginLeft: 'auto' }}>
              delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Composer() {
  const { mutate: createPost, isPending } = useCreatePost()
  const [content, setContent] = useState('')
  const max = 280
  const handlePost = () => {
    if (!content.trim() || content.length > max) return
    createPost(content.trim(), { onSuccess: () => setContent('') })
  }
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '16px' }}>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder='What is on your mind?'
        rows={3}
        maxLength={max}
        style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }}
      />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: content.length > max * 0.85 ? 'var(--warning)' : 'var(--text-muted)' }}>
          {content.length}/{max}
        </span>
        <button onClick={handlePost} disabled={isPending || !content.trim() || content.length > max} style={{ padding: '7px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: !content.trim() || isPending ? 0.6 : 1 }}>
          {isPending ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default function HubPage() {
  const [tab, setTab] = useState('feed')
  const { data: feed, isLoading: feedLoading } = useFeed()
  const { data: explore, isLoading: exploreLoading } = useExplore()
  const { mutate: likePost } = useLikePost()
  const { mutate: deletePost } = useDeletePost()
  const posts = tab === 'feed' ? feed : explore
  const isLoading = tab === 'feed' ? feedLoading : exploreLoading
  const handleDelete = (id) => {
    if (window.confirm('Delete this post?')) deletePost(id)
  }
  const tabStyle = (active) => ({
    padding: '8px 20px', background: 'none', border: 'none',
    borderBottom: '2px solid ' + (active ? 'var(--accent)' : 'transparent'),
    color: active ? 'var(--accent)' : 'var(--text-muted)',
    fontWeight: active ? 600 : 400, fontSize: '14px',
    cursor: 'pointer', transition: 'var(--transition)',
  })
  return (
    <div style={{ maxWidth: '580px' }}>
      <Composer />
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <button onClick={() => setTab('feed')} style={tabStyle(tab === 'feed')}>Feed</button>
        <button onClick={() => setTab('explore')} style={tabStyle(tab === 'explore')}>Explore</button>
      </div>
      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
      ) : posts && posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={likePost} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
            {tab === 'feed' ? 'Your feed is empty' : 'No posts yet'}
          </div>
          <div style={{ fontSize: '13px' }}>
            {tab === 'feed' ? 'Follow people or switch to Explore.' : 'Be the first to post.'}
          </div>
        </div>
      )}
    </div>
  )
}