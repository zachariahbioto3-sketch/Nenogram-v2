import { useState } from 'react'
import { useHackathons, useHackathon, useJoinHackathon, useSubmissions, useCreateSubmission, useVoteSubmission } from '../../hooks/useHackathon'
import { useFiles } from '../../hooks/useNano'
import { useAuthStore } from '../../store/authStore'

const STATUS_TABS = ['all', 'upcoming', 'active', 'ended']

function useCountdown(endAt) {
  const [now, setNow] = useState(Date.now())
  useState(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  })
  const diff = new Date(endAt) - now
  if (diff <= 0) return 'Ended'
  const h = Math.floor(diff / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return `${h}h ${m}m ${s}s`
}

function CountdownBadge({ endAt, status }) {
  const label = useCountdown(endAt)
  if (status !== 'active') return null
  return <span style={{ color: 'var(--warning)', fontSize: '0.75rem', fontFamily: 'var(--font-mono)' }}>{label}</span>
}

function HackathonCard({ h, onOpen }) {
  const join = useJoinHackathon()
  const statusColor = { upcoming: 'var(--info)', active: 'var(--success)', ended: 'var(--text-muted)' }[h.status]
  return (
    <div onClick={() => onOpen(h.id)} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', cursor: 'pointer', transition: 'var(--transition)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {h.banner && <img src={h.banner} alt={h.title} style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }} />}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
        <h3 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{h.title}</h3>
        <span style={{ color: statusColor, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{h.status}</span>
      </div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 var(--space-3)', lineHeight: 1.5 }}>{h.description.slice(0, 120)}{h.description.length > 120 ? '...' : ''}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
        <span style={{ color: 'var(--accent)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.9rem' }}>{h.prize_currency} {Number(h.prize).toLocaleString()}</span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{h.participant_count} joined</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <CountdownBadge endAt={h.end_at} status={h.status} />
        {!h.is_joined && h.status !== 'ended' && (
          <button onClick={e => { e.stopPropagation(); join.mutate(h.id) }}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '6px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
            Join
          </button>
        )}
        {h.is_joined && <span style={{ color: 'var(--success)', fontSize: '0.8rem' }}>Joined</span>}
      </div>
    </div>
  )
}

function SubmitModal({ hackathonId, onClose }) {
  const [nanoId, setNanoId] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [description, setDescription] = useState('')
  const { data: nanos } = useFiles(null)
  const submit = useCreateSubmission(hackathonId)

  const handle = () => {
    const data = { repo_url: repoUrl, description }
    if (nanoId) data.nano_file_id = parseInt(nanoId)
    submit.mutate(data, { onSuccess: onClose })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: 480 }}>
        <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>Submit Project</h3>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>Link a Nano (optional)</label>
        <select value={nanoId} onChange={e => setNanoId(e.target.value)}
          style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-3)', fontSize: '0.9rem' }}>
          <option value=''>None</option>
          {Array.isArray(nanos) ? nanos.map(n => <option key={n.id} value={n.id}>{n.name}</option>) : []}
        </select>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>Repo URL (optional if Nano selected)</label>
        <input value={repoUrl} onChange={e => setRepoUrl(e.target.value)} placeholder='https://github.com/...'
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-3)', fontSize: '0.9rem' }} />
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3}
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-4)', fontSize: '0.9rem', resize: 'vertical' }} />
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handle} disabled={submit.isPending}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            {submit.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

function LeaderboardTab({ hackathonId, isActive, isJoined }) {
  const { data, isLoading } = useSubmissions(hackathonId)
  const vote = useVoteSubmission(hackathonId)
  const user = useAuthStore((s) => s.user)
  const [showSubmit, setShowSubmit] = useState(false)

  if (isLoading) return <p style={{ color: 'var(--text-muted)' }}>Loading...</p>
  const submissions = data?.results || data || []

  return (
    <div>
      {isActive && isJoined && (
        <div style={{ marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={() => setShowSubmit(true)}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            Submit Project
          </button>
        </div>
      )}
      {showSubmit && <SubmitModal hackathonId={hackathonId} onClose={() => setShowSubmit(false)} />}
      {submissions.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-8) 0' }}>No submissions yet.</p>}
      {submissions.map((s, i) => (
        <div key={s.id} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', marginBottom: 'var(--space-3)', display: 'flex', gap: 'var(--space-4)', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: i < 3 ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', minWidth: 32, textAlign: 'center' }}>#{i + 1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>{s.participant_username}</div>
            {s.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 var(--space-2)' }}>{s.description}</p>}
            <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
              {s.nano && <a href={`/nano`} style={{ color: 'var(--accent)', fontSize: '0.82rem' }}>{s.nano.title} ({s.nano.language})</a>}
              {s.repo_url && <a href={s.repo_url} target='_blank' rel='noreferrer' style={{ color: 'var(--info)', fontSize: '0.82rem' }}>Repo</a>}
            </div>
          </div>
          <button onClick={() => vote.mutate(s.id)} disabled={s.participant_username === user?.username}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: s.has_voted ? 'var(--accent-dim)' : 'var(--bg-tertiary)', border: `1px solid ${s.has_voted ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '6px 12px', cursor: s.participant_username === user?.username ? 'default' : 'pointer', color: s.has_voted ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '0.8rem', gap: 2 }}>
            <span style={{ fontSize: '1rem' }}>â–²</span>
            {s.vote_count}
          </button>
        </div>
      ))}
    </div>
  )
}

function HackathonDetailModal({ id, onClose }) {
  const { data: h, isLoading } = useHackathon(id)
  const [tab, setTab] = useState('info')

  if (isLoading) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 998 }}>
      <p style={{ color: 'var(--text-secondary)' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 998, overflowY: 'auto', padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 680, padding: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
          <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>{h.title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.4rem', lineHeight: 1 }}>x</button>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)', paddingBottom: 'var(--space-3)' }}>
          {['info', 'leaderboard'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ background: tab === t ? 'var(--accent-dim)' : 'none', color: tab === t ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${tab === t ? 'var(--border-accent)' : 'transparent'}`, borderRadius: 'var(--radius-sm)', padding: '6px 14px', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {t}
            </button>
          ))}
        </div>
        {tab === 'info' && (
          <div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-4)' }}>{h.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
              {[['Prize', `${h.prize_currency} ${Number(h.prize).toLocaleString()}`], ['Status', h.status], ['Starts', new Date(h.start_at).toLocaleString()], ['Ends', new Date(h.end_at).toLocaleString()], ['Participants', h.participant_count], ['Host', h.created_by_username]].map(([label, val]) => (
                <div key={label} style={{ background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', padding: 'var(--space-3)' }}>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 2 }}>{label}</div>
                  <div style={{ color: 'var(--text-primary)', fontWeight: 600, fontFamily: label === 'Prize' ? 'var(--font-mono)' : 'inherit' }}>{val}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {tab === 'leaderboard' && <LeaderboardTab hackathonId={id} isActive={h.status === 'active'} isJoined={h.is_joined} />}
      </div>
    </div>
  )
}

export default function HackathonPage() {
  const [statusTab, setStatusTab] = useState('all')
  const [openId, setOpenId] = useState(null)
  const { data, isLoading } = useHackathons(statusTab === 'all' ? undefined : statusTab)
  const hackathons = data?.results || data || []

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 'var(--space-6) var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-5)' }}>
        <h1 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.5rem' }}>Hackathons</h1>
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-5)', flexWrap: 'wrap' }}>
        {STATUS_TABS.map(t => (
          <button key={t} onClick={() => setStatusTab(t)}
            style={{ background: statusTab === t ? 'var(--accent-dim)' : 'var(--bg-secondary)', color: statusTab === t ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${statusTab === t ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '7px 16px', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>
            {t}
          </button>
        ))}
      </div>
      {isLoading && <p style={{ color: 'var(--text-muted)' }}>Loading hackathons...</p>}
      {!isLoading && hackathons.length === 0 && (
        <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '2rem', marginBottom: 'var(--space-3)' }}>ðŸ</p>
          <p>No hackathons here yet.</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
        {hackathons.map(h => <HackathonCard key={h.id} h={h} onOpen={setOpenId} />)}
      </div>
      {openId && <HackathonDetailModal id={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}





