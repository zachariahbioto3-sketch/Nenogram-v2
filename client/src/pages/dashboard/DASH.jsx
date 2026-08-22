import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../hooks/useWallet'
import { useNanoFeed } from '../../hooks/useNano'

// ── Icons ─────────────────────────────────────────────────────────────────────
const IChevronRight = () => (
  <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <polyline points='9 18 15 12 9 6'/>
  </svg>
)
const IClose = () => (
  <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2.2' viewBox='0 0 24 24'>
    <line x1='18' y1='6' x2='6' y2='18'/><line x1='6' y1='6' x2='18' y2='18'/>
  </svg>
)
const ISend = () => (
  <svg width='13' height='13' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <line x1='22' y1='2' x2='11' y2='13'/><polygon points='22 2 15 22 11 13 2 9 22 2'/>
  </svg>
)
const IClock = () => (
  <svg width='12' height='12' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <circle cx='12' cy='12' r='10'/><polyline points='12 6 12 12 16 14'/>
  </svg>
)
const IUser = () => (
  <svg width='12' height='12' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <path d='M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2'/><circle cx='12' cy='7' r='4'/>
  </svg>
)

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })

const initials = (name) => (name ? name[0].toUpperCase() : 'N')

const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim()

// ── Stat & Quick-link cards (unchanged) ───────────────────────────────────────
const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: accent ? 'var(--accent)' : 'var(--bg-secondary)',
    border: accent ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '20px 22px',
    display: 'flex', flexDirection: 'column', gap: '6px',
    boxShadow: accent ? '0 4px 20px rgba(38,101,140,0.25)' : 'var(--shadow-sm)',
  }}>
    <span style={{ fontSize: '12px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)' }}>{label}</span>
    <span style={{ fontSize: '26px', fontWeight: 600, letterSpacing: '-0.5px', lineHeight: 1.1, color: accent ? '#ffffff' : 'var(--text-primary)' }}>{value}</span>
    {sub && <span style={{ fontSize: '12px', color: accent ? 'rgba(255,255,255,0.65)' : 'var(--text-muted)' }}>{sub}</span>}
  </div>
)

const QuickLink = ({ label, desc, icon, onClick }) => (
  <div onClick={onClick} style={{
    background: 'var(--bg-secondary)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)', padding: '18px 20px',
    display: 'flex', alignItems: 'center', gap: '14px',
    cursor: 'pointer', transition: 'border-color var(--transition), box-shadow var(--transition)',
  }}
  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
    <div style={{ width: '40px', height: '40px', background: 'var(--accent-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent)' }}>{icon}</div>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
    </div>
    <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}><IChevronRight /></div>
  </div>
)

// ── Article comment section ───────────────────────────────────────────────────
function ArticleComments({ articleId }) {
  const [comments, setComments] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  // Local-only comments for now (backend endpoint TBD)
  const handleSubmit = () => {
    if (!text.trim()) return
    setLoading(true)
    setTimeout(() => {
      setComments(prev => [...prev, {
        id: Date.now(),
        author: 'You',
        content: text.trim(),
        time: 'just now',
      }])
      setText('')
      setLoading(false)
    }, 300)
  }

  return (
    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginTop: '4px' }}>
      <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>
        Comments {comments.length > 0 && `(${comments.length})`}
      </p>

      {comments.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '14px' }}>No comments yet. Be the first.</p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--accent)' }}>{initials(c.author)}</span>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '3px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{c.author}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{c.time}</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder='Write a comment...'
          maxLength={500}
          style={{
            flex: 1, background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)', padding: '8px 14px', fontSize: '13px',
            color: 'var(--text-primary)', outline: 'none', fontFamily: 'inherit',
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !text.trim()}
          style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: 'var(--accent)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, color: '#fff',
            opacity: !text.trim() || loading ? 0.5 : 1,
          }}
        >
          <ISend />
        </button>
      </div>
    </div>
  )
}

// ── Article reader modal ──────────────────────────────────────────────────────
function ArticleReader({ article, onClose }) {
  const preview = article.file_type === 'richtext' ? article.content : article.content

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        zIndex: 400, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px', backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '760px',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 64px rgba(0,0,0,0.18)',
          overflow: 'hidden',
        }}
      >
        {/* ── Cover strip (accent gradient if no image) */}
        <div style={{
          height: '6px', flexShrink: 0,
          background: 'linear-gradient(90deg, var(--accent-4), var(--accent), var(--accent-1))',
        }} />

        {/* ── Header */}
        <div style={{
          padding: '22px 28px 18px', borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, margin: 0, flex: 1 }}>
              {article.name}
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                borderRadius: '50%', width: '32px', height: '32px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', color: 'var(--text-muted)', flexShrink: 0,
              }}
            >
              <IClose />
            </button>
          </div>

          {/* Author + date meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '12px', flexWrap: 'wrap' }}>
            {/* Author chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                background: 'var(--accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#fff',
              }}>
                {initials(article.owner_username)}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1 }}>
                  {article.owner_username}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '1px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <IUser /> Author
                </div>
              </div>
            </div>

            <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />

            {/* Date */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
              <IClock />
              {fmtDate(article.published_at)}
            </div>

            {/* Type badge */}
            <span style={{
              fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 600,
              background: 'var(--accent-dim)', color: 'var(--accent)',
              border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-full)',
              padding: '2px 10px', marginLeft: 'auto',
            }}>
              {article.file_type === 'richtext' ? 'Article' : article.language}
            </span>
          </div>
        </div>

        {/* ── Scrollable body: content + comments */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 32px' }}>
          {/* Article content */}
          {article.file_type === 'richtext' ? (
            <div
              className='article-reader-body'
              style={{
                fontSize: '15px', lineHeight: 1.85, color: 'var(--text-primary)',
                marginBottom: '32px',
              }}
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          ) : (
            <pre style={{
              fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)',
              lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
              margin: '0 0 32px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
              padding: '20px',
            }}>
              {preview}
            </pre>
          )}

          {/* Comments */}
          <ArticleComments articleId={article.id} />
        </div>
      </div>
    </div>
  )
}

// ── Hero article card (first item) ────────────────────────────────────────────
function HeroCard({ article, onRead }) {
  const preview = stripHtml(article.content).slice(0, 200)
  return (
    <div
      onClick={() => onRead(article)}
      style={{
        gridColumn: '1 / -1',
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', overflow: 'hidden',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'border-color var(--transition), box-shadow var(--transition)',
        boxShadow: 'var(--shadow-sm)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
    >
      {/* Colour banner */}
      <div style={{
        height: '200px', flexShrink: 0,
        background: 'linear-gradient(135deg, var(--accent-4) 0%, var(--accent) 50%, var(--accent-1) 100%)',
        display: 'flex', alignItems: 'flex-end', padding: '20px 24px',
      }}>
        <span style={{
          fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-mono)',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(6px)',
          color: '#fff', borderRadius: 'var(--radius-full)', padding: '3px 12px',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          {article.file_type === 'richtext' ? 'Article' : article.language}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '20px 24px 22px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 8px', lineHeight: 1.3 }}>
          {article.name}
        </h3>
        {preview && (
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: '0 0 14px',
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {preview}{article.content.length > 200 ? '...' : ''}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '10px', fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials(article.owner_username)}
          </div>
          <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>{article.owner_username}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>· {fmtDate(article.published_at)}</span>
          <span style={{
            marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: '4px',
          }}>
            Read article <IChevronRight />
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Grid article card ─────────────────────────────────────────────────────────
function GridCard({ article, onRead }) {
  const preview = stripHtml(article.content).slice(0, 100)
  return (
    <div
      onClick={() => onRead(article)}
      style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)', overflow: 'hidden',
        cursor: 'pointer', display: 'flex', flexDirection: 'column',
        transition: 'border-color var(--transition), box-shadow var(--transition)',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      {/* Mini banner */}
      <div style={{
        height: '80px',
        background: `linear-gradient(135deg, var(--accent-4), var(--accent-2))`,
        opacity: 0.85,
      }} />

      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', margin: 0, lineHeight: 1.4,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {article.name}
        </h4>
        {preview && (
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, flex: 1,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {preview}...
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: 'auto', paddingTop: '6px' }}>
          <div style={{
            width: '18px', height: '18px', borderRadius: '50%', background: 'var(--accent-dim)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '9px', fontWeight: 700, color: 'var(--accent)', flexShrink: 0,
          }}>
            {initials(article.owner_username)}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            {article.owner_username}
          </span>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
            {fmtDate(article.published_at)}
          </span>
        </div>
      </div>
    </div>
  )
}

// ── Nenogram Today feed ───────────────────────────────────────────────────────
function NenogramToday({ feed, onRead }) {
  if (!feed || feed.length === 0) return null
  const [hero, ...rest] = feed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px', margin: 0, marginBottom: '3px' }}>
            Nenogram Today
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>
            Articles published by the community.
          </p>
        </div>
        <span style={{
          fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)',
          background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
          padding: '3px 10px', borderRadius: 'var(--radius-full)',
        }}>
          live
        </span>
      </div>

      {/* Hero */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
        <HeroCard article={hero} onRead={onRead} />
      </div>

      {/* Grid */}
      {rest.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
          {rest.map(a => <GridCard key={a.id} article={a} onRead={onRead} />)}
        </div>
      )}
    </div>
  )
}

// ── Page root ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const user = useAuthStore(s => s.user)
  const navigate = useNavigate()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: feed, isLoading: feedLoading } = useNanoFeed()
  const [readingArticle, setReadingArticle] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const realBalance = wallet
    ? 'KSh ' + Number(wallet.real_balance).toLocaleString('en-KE', { minimumFractionDigits: 2 })
    : walletLoading ? '...' : 'KSh 0.00'
  const nenoBalance = wallet
    ? Number(wallet.nenocoin_balance).toFixed(2) + ' NC'
    : walletLoading ? '...' : '0.00 NC'

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {readingArticle && (
        <ArticleReader article={readingArticle} onClose={() => setReadingArticle(null)} />
      )}

      {/* Greeting */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
            {greeting}{user?.username ? ', ' + user.username : ''}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '4px' }}>
            Here is what is happening on your account today.
          </p>
        </div>
        {user?.is_developer && (
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontWeight: 600 }}>
            dev mode
          </span>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard label='Wallet Balance' value={realBalance} sub='Real balance' accent />
        <StatCard label='NenoCoin' value={nenoBalance} sub={'Rate: 1 NC = KSh ' + (wallet?.nenocoin_rate ?? '...')} />
        <StatCard label='Active Gigs' value='0' sub='In progress' />
        <StatCard label='Hackathons' value='0' sub='Joined' />
      </div>

      {/* Quick links + wallet snapshot */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Quick access</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <QuickLink label='Marketplace' desc='Browse gigs and post work' onClick={() => navigate('/marketplace')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M3 9l9-6 9 6v11a2 2 0 01-2 2H5a2 2 0 01-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg>} />
            <QuickLink label='Nano' desc='Files, notes and published docs' onClick={() => navigate('/nano')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/><polyline points='14 2 14 8 20 8'/></svg>} />
            <QuickLink label='Hackathons' desc='Compete and win prizes' onClick={() => navigate('/hackathon')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><path d='M6 9H4.5a2.5 2.5 0 000 5H6'/><path d='M18 9h1.5a2.5 2.5 0 010 5H18'/><path d='M8 9h8'/><path d='M8 15h8'/><path d='M12 3v18'/></svg>} />
            <QuickLink label='Hub' desc='Connect with the community' onClick={() => navigate('/hub')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/><path d='M8 14s1.5 2 4 2 4-2 4-2'/><line x1='9' y1='9' x2='9.01' y2='9'/><line x1='15' y1='9' x2='15.01' y2='9'/></svg>} />
            <QuickLink label='Wallet' desc='Top up, withdraw, transfer' onClick={() => navigate('/wallet')}
              icon={<svg width='18' height='18' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'><rect x='2' y='5' width='20' height='14' rx='2'/><path d='M16 12h2'/></svg>} />
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Wallet snapshot</span>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-sm)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Real balance</span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{realBalance}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>NenoCoin</span>
              <span style={{ fontSize: '18px', fontWeight: 600, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>{nenoBalance}</span>
            </div>
            <div style={{ height: '1px', background: 'var(--border)' }} />
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => navigate('/wallet')} style={{ flex: 1, padding: '9px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Top Up</button>
              <button onClick={() => navigate('/wallet')} style={{ flex: 1, padding: '9px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)' }}>Transfer</button>
            </div>
          </div>
        </div>
      </div>

      {/* Platform status bar */}
      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: 'var(--shadow-sm)', gap: '12px', flexWrap: 'wrap' }}>
        {[
          { label: 'Platform', value: 'Nenogram V2' },
          { label: 'Stack', value: 'React + Django' },
          { label: 'Currency', value: 'KSh + NC' },
          { label: 'Payments', value: 'M-Pesa' },
          { label: 'Status', value: 'Active', ok: true },
        ].map(({ label, value, ok }) => (
          <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-mono)', color: ok ? 'var(--success)' : 'var(--text-primary)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Nenogram Today */}
      {feedLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>Loading feed...</div>
      ) : feed && feed.length > 0 ? (
        <NenogramToday feed={feed} onRead={setReadingArticle} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Nenogram Today</h2>
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Nothing published yet</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>Make a file public in Nano and publish it to appear here.</div>
            <button onClick={() => navigate('/nano')} style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Open Nano</button>
          </div>
        </div>
      )}
    </div>
  )
}
