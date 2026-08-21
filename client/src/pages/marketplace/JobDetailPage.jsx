import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useJob, useJobBids, usePlaceBid, useAcceptBid, useRejectBid } from '../../hooks/useMarketplace'

function BidCard({ bid, isOwner, onAccept, onReject, accepting, rejecting }) {
  return (
    <div style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 700 }}>{(bid.developer?.username?.[0] ?? 'D').toUpperCase()}</span>
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{bid.developer?.username}</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{bid.developer?.email}</div>
          </div>
        </div>
        <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', background: bid.status === 'accepted' ? 'rgba(74,222,128,0.1)' : bid.status === 'rejected' ? 'rgba(248,113,113,0.1)' : 'var(--accent-dim)', color: bid.status === 'accepted' ? 'var(--success)' : bid.status === 'rejected' ? 'var(--danger)' : 'var(--accent)' }}>
          {bid.status}
        </span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>amount</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>KES {Number(bid.amount).toLocaleString()}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>timeline</div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>{bid.timeline_days} days</div>
        </div>
      </div>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, padding: '10px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
        {bid.cover_letter}
      </div>
      {isOwner && bid.status === 'pending' && (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onAccept(bid.id)} disabled={accepting} style={{ flex: 1, padding: '8px', background: 'var(--success)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '12px', cursor: accepting ? 'not-allowed' : 'pointer', opacity: accepting ? 0.7 : 1 }}>
            {accepting ? 'Accepting...' : 'Accept'}
          </button>
          <button onClick={() => onReject(bid.id)} disabled={rejecting} style={{ flex: 1, padding: '8px', background: 'transparent', border: '1px solid var(--danger)', borderRadius: 'var(--radius-md)', color: 'var(--danger)', fontWeight: 600, fontSize: '12px', cursor: rejecting ? 'not-allowed' : 'pointer' }}>
            {rejecting ? 'Rejecting...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  )
}

function PlaceBidForm({ jobId, onDone }) {
  const { mutate: placeBid, isPending } = usePlaceBid(jobId)
  const [form, setForm] = useState({ amount: '', timeline_days: '', cover_letter: '' })
  const [errors, setErrors] = useState({})
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const handleSubmit = () => {
    const errs = {}
    if (!form.amount || isNaN(form.amount) || Number(form.amount) <= 0) errs.amount = 'Valid amount required'
    if (!form.timeline_days || isNaN(form.timeline_days)) errs.timeline_days = 'Required'
    if (!form.cover_letter.trim() || form.cover_letter.trim().length < 50) errs.cover_letter = 'At least 50 characters required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    placeBid({ amount: Number(form.amount), timeline_days: Number(form.timeline_days), cover_letter: form.cover_letter.trim() }, { onSuccess: onDone })
  }
  const inputStyle = (field) => ({ width: '100%', padding: '9px 12px', background: 'var(--bg-tertiary)', border: '1px solid ' + (errors[field] ? 'var(--danger)' : 'var(--border)'), borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' })
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-lg)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>Place a Bid</div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>your amount (KES)</label>
          <input type='number' value={form.amount} onChange={set('amount')} placeholder='e.g. 8000' style={inputStyle('amount')} />
          {errors.amount && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.amount}</div>}
        </div>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>timeline (days)</label>
          <input type='number' value={form.timeline_days} onChange={set('timeline_days')} placeholder='e.g. 14' style={inputStyle('timeline_days')} />
          {errors.timeline_days && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.timeline_days}</div>}
        </div>
      </div>
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>cover letter (min 50 chars)</label>
        <textarea value={form.cover_letter} onChange={set('cover_letter')} placeholder='Explain why you are the best fit for this job...' rows={5} style={{ ...inputStyle('cover_letter'), resize: 'vertical', fontFamily: 'inherit' }} />
        <div style={{ fontSize: '10px', color: form.cover_letter.length < 50 ? 'var(--text-muted)' : 'var(--success)', marginTop: '3px', fontFamily: 'var(--font-mono)' }}>{form.cover_letter.length} / 50 min</div>
        {errors.cover_letter && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.cover_letter}</div>}
      </div>
      <button onClick={handleSubmit} disabled={isPending} style={{ padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
        {isPending ? 'Submitting...' : 'Submit Bid'}
      </button>
    </div>
  )
}

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: job, isLoading: jobLoading } = useJob(id)
  const { data: bids, isLoading: bidsLoading } = useJobBids(id)
  const { mutate: acceptBid, isPending: accepting } = useAcceptBid(id)
  const { mutate: rejectBid, isPending: rejecting } = useRejectBid(id)
  const [showBidForm, setShowBidForm] = useState(false)

  if (jobLoading) return <div style={{ color: 'var(--text-muted)', fontSize: '14px', padding: '40px' }}>Loading job...</div>
  if (!job) return <div style={{ color: 'var(--danger)', fontSize: '14px', padding: '40px' }}>Job not found.</div>

  const isOwner = user?.id === job.client?.id
  const isDevelope = user?.is_developer
  const myBid = bids?.find((b) => b.developer?.id === user?.id)
  const canBid = isDevelope && !isOwner && !myBid && job.status === 'open'

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <button onClick={() => navigate('/marketplace')} style={{ alignSelf: 'flex-start', padding: '6px 14px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>
        Back to Marketplace
      </button>

      <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 10px', borderRadius: 'var(--radius-sm)' }}>{job.category}</span>
          <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)', background: job.status === 'open' ? 'rgba(74,222,128,0.1)' : 'var(--bg-tertiary)', color: job.status === 'open' ? 'var(--success)' : 'var(--text-muted)' }}>{job.status}</span>
        </div>
        <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>{job.title}</div>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{job.description}</div>
        {job.skills_required && (
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: '6px' }}>skills required</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {(Array.isArray(job.skills_required) ? job.skills_required : job.skills_required.split(',').map((s) => s.trim())).filter(Boolean).map((s) => (
                <span key={s} style={{ fontSize: '11px', color: 'var(--text-secondary)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: '24px', paddingTop: '12px', borderTop: '1px solid var(--border)', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>budget</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>KES {Number(job.budget_min).toLocaleString()} - {Number(job.budget_max).toLocaleString()}</div>
          </div>
          {job.deadline && (
            <div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>deadline</div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.deadline}</div>
            </div>
          )}
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>bids</div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)' }}>{job.bid_count || 0}</div>
          </div>
        </div>
      </div>

      {canBid && !showBidForm && (
        <button onClick={() => setShowBidForm(true)} style={{ padding: '12px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
          Place a Bid
        </button>
      )}

      {myBid && !isOwner && (
        <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: '13px', color: 'var(--success)' }}>
          You have already bid KES {Number(myBid.amount).toLocaleString()} on this job. Status: {myBid.status}.
        </div>
      )}

      {showBidForm && canBid && <PlaceBidForm jobId={id} onDone={() => setShowBidForm(false)} />}

      {(isOwner || myBid) && (
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
            {isOwner ? 'All Bids (' + (bids?.length || 0) + ')' : 'Your Bid'}
          </div>
          {bidsLoading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading bids...</div>
          ) : bids && bids.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {bids.map((bid) => (
                <BidCard key={bid.id} bid={bid} isOwner={isOwner} onAccept={acceptBid} onReject={rejectBid} accepting={accepting} rejecting={rejecting} />
              ))}
            </div>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No bids yet.</div>
          )}
        </div>
      )}
    </div>
  )
}


