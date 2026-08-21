import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../../hooks/useWallet'
import { useNanoFeed } from '../../hooks/useNano'

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: accent ? 'var(--accent)' : 'var(--bg-secondary)',
    border: accent ? 'none' : '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px 22px',
    display: 'flex', flexDirection: 'column', gap: '6px',
    boxShadow: accent ? '0 4px 20px rgba(38,101,140,0.25)' : 'var(--shadow-sm)',
  }}>
    <span style={{ fontSize: '12px', fontWeight: 500, color: accent ? 'rgba(255,255,255,0.75)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
      {label}
    </span>
    <span style={{ fontSize: '26px', fontWeight: 600, color: accent ? '#ffffff' : 'var(--text-primary)', letterSpacing: '-0.5px', lineHeight: 1.1 }}>
      {value}
    </span>
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
  onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
    <div style={{ width: '40px', height: '40px', background: 'var(--accent-dim)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'var(--accent)' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{label}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
    </div>
    <div style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
      <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'><polyline points='9 18 15 12 9 6'/></svg>
    </div>
  </div>
)

function ArticleCard({ article, onRead }) {
  const langDot = {
    python:'#3572A5', javascript:'#f1c21b', typescript:'#3178c6', jsx:'#61dafb',
    html:'#e34c26', css:'#563d7c', json:'#6b7280', markdown:'#083fa1',
    bash:'#22c55e', sql:'#e38c00', plaintext:'#9ca3af',
  }
  const preview = article.file_type === 'richtext'
    ? article.content.replace(/<[^>]+>/g, '').slice(0, 160)
    : article.content.slice(0, 160)
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '20px 22px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'border-color var(--transition), box-shadow var(--transition)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
        <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{article.name}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-full)', padding: '2px 8px', whiteSpace: 'nowrap', flexShrink: 0 }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: langDot[article.language] ?? '#9ca3af', display: 'inline-block' }} />
          {article.language}
        </span>
      </div>
      {preview && (
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {preview}{article.content.length > 160 ? '...' : ''}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
            {article.owner_username?.[0]?.toUpperCase() ?? 'N'}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{article.owner_username}</span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {new Date(article.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <button onClick={() => onRead(article)} style={{
          padding: '5px 14px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-full)', color: 'var(--accent)', fontSize: '12px',
          fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
        }}>Read</button>
      </div>
    </div>
  )
}

function ArticleReader({ article, onClose }) {
  const preview = article.file_type === 'richtext'
    ? article.content
    : article.content
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '740px',
        maxHeight: '85vh', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '3px' }}>{article.name}</div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              by {article.owner_username} &middot; {new Date(article.published_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px', lineHeight: 1, padding: '4px 8px' }}>x</button>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
          {article.file_type === 'richtext' ? (
            <div style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-primary)' }} dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <pre style={{ fontSize: '13px', fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word', margin: 0 }}>{preview}</pre>
          )}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: wallet, isLoading: walletLoading } = useWallet()
  const { data: feed, isLoading: feedLoading } = useNanoFeed()
  const [readingArticle, setReadingArticle] = useState(null)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const realBalance = wallet ? 'KSh ' + Number(wallet.real_balance).toLocaleString('en-KE', { minimumFractionDigits: 2 }) : walletLoading ? '...' : 'KSh 0.00'
  const nenoBalance = wallet ? Number(wallet.nenocoin_balance).toFixed(2) + ' NC' : walletLoading ? '...' : '0.00 NC'

  return (
    <div style={{ maxWidth: '1100px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {readingArticle && <ArticleReader article={readingArticle} onClose={() => setReadingArticle(null)} />}

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
        <StatCard label='Wallet Balance' value={realBalance} sub='Real balance' accent />
        <StatCard label='NenoCoin' value={nenoBalance} sub={'Rate: 1 NC = KSh ' + (wallet?.nenocoin_rate ?? '...')} />
        <StatCard label='Active Gigs' value='0' sub='In progress' />
        <StatCard label='Hackathons' value='0' sub='Joined' />
      </div>

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
            <span style={{ fontSize: '13px', fontWeight: 600, color: ok ? 'var(--success)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{value}</span>
          </div>
        ))}
      </div>

      {/* â”€â”€ Nenogram Today â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px', margin: 0, marginBottom: '3px' }}>Nenogram Today</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>Articles and files published by the community.</p>
          </div>
          <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', padding: '3px 10px', borderRadius: 'var(--radius-full)' }}>live</span>
        </div>

        {feedLoading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '20px 0' }}>Loading feed...</div>
        ) : feed && feed.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {feed.map(article => (
              <ArticleCard key={article.id} article={article} onRead={setReadingArticle} />
            ))}
          </div>
        ) : (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>Nothing published yet</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '18px' }}>Make a file public in Nano and publish it to appear here.</div>
            <button onClick={() => navigate('/nano')} style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Open Nano</button>
          </div>
        )}
      </div>

    </div>
  )
}


