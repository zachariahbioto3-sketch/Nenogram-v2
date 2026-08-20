import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useFeed, useExplore, useCreatePost, useDeletePost, useLikePost, useFollowUser, useComments, useCreateComment, useDeleteComment } from '../../hooks/useSocial'

const MEDIA_URL = 'http://localhost:8000/media/'

function CommentSection({ postId }) {
  const user = useAuthStore((s) => s.user)
  const [text, setText] = useState('')
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useComments(postId)
  const { mutate: createComment, isPending } = useCreateComment(postId)
  const { mutate: deleteComment } = useDeleteComment(postId)
  const comments = data?.comments ?? []
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }
  const handleSubmit = () => {
    if (!text.trim()) return
    createComment(text.trim(), { onSuccess: () => setText('') })
  }
  return (
    <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border)' }}>
      {isLoading ? (
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Loading comments...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
          {comments.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{c.author_username[0].toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: '6px 10px' }}>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '2px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.author_display}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{timeAgo(c.created_at)}</span>
                  {c.author_username === user?.username && (
                    <button onClick={() => deleteComment(c.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '10px', cursor: 'pointer' }}>delete</button>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{c.content}</p>
              </div>
            </div>
          ))}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
              {isFetchingNextPage ? 'Loading...' : 'Load more comments'}
            </button>
          )}
        </div>
      )}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} placeholder='Write a comment...' maxLength={500} style={{ flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '13px', color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit' }} />
        <button onClick={handleSubmit} disabled={isPending || !text.trim()} style={{ padding: '6px 14px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-sm)', color: '#0a0a0a', fontWeight: 700, fontSize: '12px', cursor: 'pointer', opacity: !text.trim() || isPending ? 0.6 : 1 }}>
          {isPending ? '...' : 'Send'}
        </button>
      </div>
    </div>
  )
}

function PostCard({ post, onLike, onDelete, onFollow }) {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const isOwn = user?.username === post.author_username
  const [showComments, setShowComments] = useState(false)
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', gap: '12px' }}>
      <div onClick={() => navigate('/profile/' + post.author_username)} style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)' }}>{post.author_username[0].toUpperCase()}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <span onClick={() => navigate('/profile/' + post.author_username)} style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>{post.author_display || post.author_username}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{post.author_username}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>{timeAgo(post.created_at)}</span>
          {!isOwn && (
            <button onClick={() => onFollow(post.author_username)} style={{ fontSize: '11px', padding: '2px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-accent)', background: post.is_following ? 'var(--accent-dim)' : 'transparent', color: post.is_following ? 'var(--accent)' : 'var(--text-muted)', cursor: 'pointer', fontFamily: 'var(--font-mono)' }}>
              {post.is_following ? 'following' : 'follow'}
            </button>
          )}
        </div>
        <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, marginBottom: post.image ? '10px' : '10px', wordBreak: 'break-word' }}>{post.content}</p>
        {post.image && (
          <div style={{ marginBottom: '10px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={post.image.startsWith('http') ? post.image : MEDIA_URL + post.image} alt='post' style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => onLike(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: post.is_liked ? 'var(--danger)' : 'var(--text-muted)', fontSize: '12px', padding: '2px 0' }}>
            <svg width='14' height='14' fill={post.is_liked ? 'currentColor' : 'none'} stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z'/></svg>
            {post.like_count}
          </button>
          <button onClick={() => setShowComments((v) => !v)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', color: showComments ? 'var(--accent)' : 'var(--text-muted)', fontSize: '12px', padding: '2px 0' }}>
            <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><path d='M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z'/></svg>
            {post.comment_count ?? 0}
          </button>
          {isOwn && (
            <button onClick={() => onDelete(post.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '12px', marginLeft: 'auto' }}>delete</button>
          )}
        </div>
        {showComments && <CommentSection postId={post.id} />}
      </div>
    </div>
  )
}

function Composer() {
  const { mutate: createPost, isPending } = useCreatePost()
  const [content, setContent] = useState('')
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const fileRef = useRef(null)
  const max = 280
  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }
  const removeImage = () => {
    setImage(null)
    setPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }
  const handlePost = () => {
    if (!content.trim() || content.length > max) return
    createPost({ content: content.trim(), image }, {
      onSuccess: () => {
        setContent('')
        removeImage()
      }
    })
  }
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', marginBottom: '16px' }}>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder='What is on your mind?' rows={3} maxLength={max} style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--text-primary)', fontSize: '14px', lineHeight: 1.6, fontFamily: 'inherit', boxSizing: 'border-box' }} />
      {preview && (
        <div style={{ position: 'relative', marginBottom: '10px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
          <img src={preview} alt='preview' style={{ width: '100%', maxHeight: '240px', objectFit: 'cover', display: 'block' }} />
          <button onClick={removeImage} style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => fileRef.current?.click()} style={{ background: 'none', border: 'none', cursor: 'pointer', color: image ? 'var(--accent)' : 'var(--text-muted)', padding: '0', display: 'flex', alignItems: 'center' }} title='Attach image'>
            <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><rect x='3' y='3' width='18' height='18' rx='2'/><circle cx='8.5' cy='8.5' r='1.5'/><path d='M21 15l-5-5L5 21'/></svg>
          </button>
          <input ref={fileRef} type='file' accept='image/*' onChange={handleImage} style={{ display: 'none' }} />
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: content.length > max * 0.85 ? 'var(--warning)' : 'var(--text-muted)' }}>{content.length}/{max}</span>
        </div>
        <button onClick={handlePost} disabled={isPending || !content.trim() || content.length > max} style={{ padding: '7px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: !content.trim() || isPending ? 0.6 : 1 }}>
          {isPending ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  )
}

export default function HubPage() {
  const [tab, setTab] = useState('feed')
  const feedQuery = useFeed()
  const exploreQuery = useExplore()
  const { mutate: likePost } = useLikePost()
  const { mutate: deletePost } = useDeletePost()
  const { mutate: followUser } = useFollowUser()
  const activeQuery = tab === 'feed' ? feedQuery : exploreQuery
  const posts = activeQuery.data?.posts ?? activeQuery.data ?? []
  const isLoading = activeQuery.isLoading
  const handleDelete = (id) => { if (window.confirm('Delete this post?')) deletePost(id) }
  const tabStyle = (active) => ({ padding: '8px 20px', background: 'none', border: 'none', borderBottom: '2px solid ' + (active ? 'var(--accent)' : 'transparent'), color: active ? 'var(--accent)' : 'var(--text-muted)', fontWeight: active ? 600 : 400, fontSize: '14px', cursor: 'pointer', transition: 'var(--transition)' })
  return (
    <div style={{ maxWidth: '580px' }}>
      <Composer />
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <button onClick={() => setTab('feed')} style={tabStyle(tab === 'feed')}>Feed</button>
        <button onClick={() => setTab('explore')} style={tabStyle(tab === 'explore')}>Explore</button>
      </div>
      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
      ) : posts.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onLike={likePost} onDelete={handleDelete} onFollow={followUser} />
          ))}
          {activeQuery.hasNextPage && (
            <button onClick={() => activeQuery.fetchNextPage()} disabled={activeQuery.isFetchingNextPage} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', marginTop: '8px' }}>
              {activeQuery.isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>??</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>{tab === 'feed' ? 'Your feed is empty' : 'No posts yet'}</div>
          <div style={{ fontSize: '13px' }}>{tab === 'feed' ? 'Follow people or switch to Explore.' : 'Be the first to post.'}</div>
        </div>
      )}
    </div>
  )
}