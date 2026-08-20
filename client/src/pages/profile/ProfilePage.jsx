import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useProfile } from '../../hooks/useProfile'
import { useUserPosts, useFollowUser } from '../../hooks/useSocial'

function SkillTag({ skill }) {
  return (
    <span style={{ fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '3px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>
      {skill}
    </span>
  )
}

function GigMiniCard({ gig }) {
  return (
    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {gig.category && <span style={{ fontSize: '10px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{gig.category.name}</span>}
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{gig.title}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{gig.delivery_days}d delivery</span>
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>KES {Number(gig.price).toLocaleString()}</span>
      </div>
    </div>
  )
}

function PostCard({ post }) {
  const timeAgo = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000
    if (diff < 60) return 'just now'
    if (diff < 3600) return Math.floor(diff / 60) + 'm'
    if (diff < 86400) return Math.floor(diff / 3600) + 'h'
    return Math.floor(diff / 86400) + 'd'
  }
  return (
    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
      <p style={{ fontSize: '14px', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, marginBottom: '8px' }}>{post.content}</p>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{timeAgo(post.created_at)}</span>
        <span style={{ fontSize: '12px', color: post.is_liked ? 'var(--danger)' : 'var(--text-muted)' }}>? {post.like_count}</span>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { username } = useParams()
  const navigate = useNavigate()
  const authUser = useAuthStore((s) => s.user)
  const [tab, setTab] = useState('profile')
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!username && authUser?.username) navigate('/profile/' + authUser.username, { replace: true })
  }, [username, authUser, navigate])

  const { data: profile, isLoading, isError } = useProfile(username)
  const { data: postsData, hasNextPage, fetchNextPage, isFetchingNextPage } = useUserPosts(username)
  const { mutate: followUser } = useFollowUser()
  const isOwnProfile = authUser?.username === username
  const posts = postsData?.posts ?? []

  useEffect(() => {
    if (profile?.is_following !== undefined) setIsFollowing(profile.is_following)
  }, [profile])

  const handleFollow = () => {
    followUser(username, {
      onSuccess: (data) => setIsFollowing(data.following)
    })
  }

  if (!username) return null
  if (isLoading) return <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading profile...</div>
  if (isError || !profile) return <div style={{ color: 'var(--danger)', fontSize: '14px' }}>Profile not found.</div>

  const tabStyle = (active) => ({ padding: '8px 20px', background: 'none', border: 'none', borderBottom: '2px solid ' + (active ? 'var(--accent)' : 'transparent'), color: active ? 'var(--accent)' : 'var(--text-muted)', fontWeight: active ? 600 : 400, fontSize: '13px', cursor: 'pointer' })

  return (
    <div style={{ maxWidth: '640px' }}>

      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-dim)', border: '2px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{profile.username[0].toUpperCase()}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)' }}>{profile.display_name || profile.username}</span>
              {profile.display_name && <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>@{profile.username}</span>}
              {profile.is_developer && profile.developer_profile?.is_available && (
                <span style={{ fontSize: '10px', color: 'var(--success)', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>available</span>
              )}
            </div>
            {profile.bio && <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '8px' }}>{profile.bio}</p>}
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              joined {new Date(profile.date_joined).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' })}
            </div>
          </div>
          {isOwnProfile ? (
            <Link to='/settings' style={{ padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '12px', textDecoration: 'none', whiteSpace: 'nowrap' }}>Edit Profile</Link>
          ) : (
            <button onClick={handleFollow} style={{ padding: '7px 18px', background: isFollowing ? 'var(--accent-dim)' : 'var(--accent)', border: isFollowing ? '1px solid var(--border-accent)' : 'none', borderRadius: 'var(--radius-md)', color: isFollowing ? 'var(--accent)' : '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
        <button onClick={() => setTab('profile')} style={tabStyle(tab === 'profile')}>Profile</button>
        <button onClick={() => setTab('posts')} style={tabStyle(tab === 'posts')}>Posts {posts.length > 0 && `(${postsData?.pages?.[0]?.count ?? ''})`}</button>
      </div>

      {tab === 'profile' && (
        <>
          {profile.is_developer && profile.developer_profile && (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>developer</span>
              </div>
              {profile.developer_profile.tagline && <p style={{ fontSize: '14px', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '12px', lineHeight: 1.5 }}>{profile.developer_profile.tagline}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '2px' }}>hourly rate</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>KES {Number(profile.developer_profile.hourly_rate).toLocaleString()} / hr</div>
                </div>
                {profile.developer_profile.portfolio_url && (
                  <a href={profile.developer_profile.portfolio_url} target='_blank' rel='noreferrer' style={{ fontSize: '12px', color: 'var(--accent)', textDecoration: 'none', fontFamily: 'var(--font-mono)' }}>portfolio ?</a>
                )}
              </div>
              {profile.developer_profile.skills?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {profile.developer_profile.skills.map((skill) => <SkillTag key={skill} skill={skill} />)}
                </div>
              )}
            </div>
          )}
          {profile.gigs?.length > 0 && (
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '12px' }}>Gigs <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{profile.gigs.length}</span></div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                {profile.gigs.map((gig) => <GigMiniCard key={gig.id} gig={gig} />)}
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'posts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {posts.length > 0 ? posts.map((post) => <PostCard key={post.id} post={post} />) : (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '14px' }}>No posts yet.</div>
          )}
          {hasNextPage && (
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} style={{ padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer' }}>
              {isFetchingNextPage ? 'Loading...' : 'Load more'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}