import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { useGigs, useCategories, useCreateGig, useJobs, useCreateJob } from '../../hooks/useMarketplace'

const ShoppingBagIcon = () => (
  <svg width='32' height='32' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
    <path d='M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z'/>
    <line x1='3' y1='6' x2='21' y2='6'/>
    <path d='M16 10a4 4 0 01-8 0'/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg width='32' height='32' fill='none' stroke='currentColor' strokeWidth='1.5' viewBox='0 0 24 24'>
    <rect x='2' y='7' width='20' height='14' rx='2'/>
    <path d='M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2'/>
    <line x1='12' y1='12' x2='12' y2='12'/>
    <path d='M2 12h20'/>
  </svg>
)

function GigCard({ gig }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', transition: 'border-color var(--transition)' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {gig.category && (
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', alignSelf: 'flex-start' }}>
          {gig.category.name}
        </span>
      )}
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{gig.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
        {gig.description}
      </div>
      {gig.tags && gig.tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {gig.tags.slice(0, 3).map((tag) => (
            <span key={tag} style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>{tag}</span>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 700 }}>{gig.developer.username[0].toUpperCase()}</span>
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{gig.developer.username}</span>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>KES {Number(gig.price).toLocaleString()}</div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{gig.delivery_days}d delivery</div>
        </div>
      </div>
    </div>
  )
}

function JobCard({ job, onClick }) {
  const budgetLabel = 'KES ' + Number(job.budget_min).toLocaleString() + ' - ' + Number(job.budget_max).toLocaleString()
  return (
    <div onClick={onClick} style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer', transition: 'border-color var(--transition)' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-accent)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '10px', fontFamily: 'var(--font-mono)', color: 'var(--accent)', background: 'var(--accent-dim)', padding: '2px 8px', borderRadius: 'var(--radius-sm)' }}>{job.category}</span>
        <span style={{ fontSize: '10px', color: 'var(--success)', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-mono)' }}>{job.status}</span>
      </div>
      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>{job.title}</div>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{job.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>{budgetLabel}</div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{job.bid_count || 0} bid{job.bid_count !== 1 ? 's' : ''}</div>
      </div>
      {job.deadline && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>deadline: {job.deadline}</div>
      )}
    </div>
  )
}

function CreateGigModal({ onClose }) {
  const { mutate: createGig, isPending } = useCreateGig()
  const { data: categories } = useCategories()
  const [form, setForm] = useState({ title: '', description: '', price: '', delivery_days: '7', tags: '', category_id: '' })
  const [errors, setErrors] = useState({})
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const handleSubmit = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title required'
    if (!form.description.trim()) errs.description = 'Description required'
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = 'Valid price required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    createGig({ title: form.title.trim(), description: form.description.trim(), price: Number(form.price), delivery_days: Number(form.delivery_days) || 7, tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean), category_id: form.category_id ? Number(form.category_id) : null }, { onSuccess: onClose })
  }
  const inputStyle = (field) => ({ width: '100%', padding: '9px 12px', background: 'var(--bg-tertiary)', border: '1px solid ' + (errors[field] ? 'var(--danger)' : 'var(--border)'), borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' })
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '460px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Post a Gig</div>
        {[{ label: 'title', field: 'title', placeholder: 'e.g. I will build your React app' }, { label: 'price (KES)', field: 'price', placeholder: 'e.g. 5000', type: 'number' }, { label: 'delivery days', field: 'delivery_days', placeholder: '7', type: 'number' }, { label: 'tags (comma separated)', field: 'tags', placeholder: 'e.g. react, api, mobile' }].map(({ label, field, placeholder, type }) => (
          <div key={field} style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>{label}</label>
            <input type={type || 'text'} value={form[field]} onChange={set(field)} placeholder={placeholder} style={inputStyle(field)} />
            {errors[field] && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors[field]}</div>}
          </div>
        ))}
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>description</label>
          <textarea value={form.description} onChange={set('description')} placeholder='Describe what you offer...' rows={4} style={{ ...inputStyle('description'), resize: 'vertical', fontFamily: 'inherit' }} />
          {errors.description && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.description}</div>}
        </div>
        {categories && categories.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>category</label>
            <select value={form.category_id} onChange={set('category_id')} style={{ ...inputStyle('category_id'), cursor: 'pointer' }}>
              <option value=''>No category</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        )}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={isPending} style={{ flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Posting...' : 'Post Gig'}
          </button>
        </div>
      </div>
    </div>
  )
}

function CreateJobModal({ onClose }) {
  const { mutate: createJob, isPending } = useCreateJob()
  const [form, setForm] = useState({ title: '', description: '', category: 'web', skills_required: '', budget_min: '', budget_max: '', deadline: '' })
  const [errors, setErrors] = useState({})
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const categories = ['web', 'mobile', 'api', 'data', 'design', 'ecommerce', 'automation', 'other']
  const handleSubmit = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = 'Title required'
    if (!form.description.trim()) errs.description = 'Description required'
    if (!form.budget_min || isNaN(form.budget_min)) errs.budget_min = 'Required'
    if (!form.budget_max || isNaN(form.budget_max)) errs.budget_max = 'Required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    createJob({ title: form.title.trim(), description: form.description.trim(), category: form.category, skills_required: form.skills_required.trim(), budget_min: Number(form.budget_min), budget_max: Number(form.budget_max), deadline: form.deadline || null }, { onSuccess: onClose })
  }
  const inputStyle = (field) => ({ width: '100%', padding: '9px 12px', background: 'var(--bg-tertiary)', border: '1px solid ' + (errors[field] ? 'var(--danger)' : 'var(--border)'), borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' })
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', padding: '28px', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px' }}>Post a Job</div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>title</label>
          <input value={form.title} onChange={set('title')} placeholder='e.g. Need a React developer for 2 weeks' style={inputStyle('title')} />
          {errors.title && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.title}</div>}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>category</label>
          <select value={form.category} onChange={set('category')} style={{ ...inputStyle('category'), cursor: 'pointer' }}>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>description</label>
          <textarea value={form.description} onChange={set('description')} placeholder='Describe the job in detail...' rows={4} style={{ ...inputStyle('description'), resize: 'vertical', fontFamily: 'inherit' }} />
          {errors.description && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.description}</div>}
        </div>
        <div style={{ marginBottom: '12px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>skills required (comma separated)</label>
          <input value={form.skills_required} onChange={set('skills_required')} placeholder='e.g. React, Django, PostgreSQL' style={inputStyle('skills_required')} />
        </div>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '12px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>budget min (KES)</label>
            <input type='number' value={form.budget_min} onChange={set('budget_min')} placeholder='e.g. 5000' style={inputStyle('budget_min')} />
            {errors.budget_min && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.budget_min}</div>}
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>budget max (KES)</label>
            <input type='number' value={form.budget_max} onChange={set('budget_max')} placeholder='e.g. 20000' style={inputStyle('budget_max')} />
            {errors.budget_max && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '3px' }}>{errors.budget_max}</div>}
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>deadline (optional)</label>
          <input type='date' value={form.deadline} onChange={set('deadline')} style={inputStyle('deadline')} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={isPending} style={{ flex: 1, padding: '10px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Posting...' : 'Post Job'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MarketplacePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const { data: categories } = useCategories()
  const [tab, setTab] = useState('gigs')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [activeCategory, setActiveCategory] = useState('')
  const [budgetFilter, setBudgetFilter] = useState('')
  const [showCreateGig, setShowCreateGig] = useState(false)
  const [showCreateJob, setShowCreateJob] = useState(false)

  const { data: gigs, isLoading: gigsLoading } = useGigs({ search: search || undefined, category: activeCategory || undefined })
  const { data: jobs, isLoading: jobsLoading } = useJobs({ q: search || undefined, category: activeCategory || undefined, budget: budgetFilter || undefined })

  const handleSearch = (e) => { if (e.key === 'Enter') setSearch(searchInput) }
  const tabStyle = (t) => ({ padding: '7px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: tab === t ? 'var(--accent)' : 'var(--border)', background: tab === t ? 'var(--accent-dim)' : 'transparent', color: tab === t ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: tab === t ? 600 : 400, cursor: 'pointer' })

  return (
    <div>
      {showCreateGig && <CreateGigModal onClose={() => setShowCreateGig(false)} />}
      {showCreateJob && <CreateJobModal onClose={() => setShowCreateJob(false)} />}

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button onClick={() => setTab('gigs')} style={tabStyle('gigs')}>Gigs</button>
        <button onClick={() => setTab('jobs')} style={tabStyle('jobs')}>Jobs</button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearch} placeholder='Search... (Enter to search)' style={{ flex: 1, minWidth: '200px', padding: '9px 14px', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }} />
        {tab === 'gigs' && user?.is_developer && (
          <button onClick={() => setShowCreateGig(true)} style={{ padding: '9px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Post Gig</button>
        )}
        {tab === 'jobs' && (
          <button onClick={() => setShowCreateJob(true)} style={{ padding: '9px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ Post Job</button>
        )}
      </div>

      {tab === 'gigs' && categories && categories.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveCategory('')} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: activeCategory === '' ? 'var(--accent)' : 'var(--border)', background: activeCategory === '' ? 'var(--accent-dim)' : 'transparent', color: activeCategory === '' ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>All</button>
          {categories.map((c) => (
            <button key={c.id} onClick={() => setActiveCategory(c.slug)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: activeCategory === c.slug ? 'var(--accent)' : 'var(--border)', background: activeCategory === c.slug ? 'var(--accent-dim)' : 'transparent', color: activeCategory === c.slug ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>{c.name}</button>
          ))}
        </div>
      )}

      {tab === 'jobs' && (
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {[['', 'Any budget'], ['low', 'Under 20k'], ['mid', '20k - 100k'], ['high', 'Over 100k']].map(([val, label]) => (
            <button key={val} onClick={() => setBudgetFilter(val)} style={{ padding: '5px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: budgetFilter === val ? 'var(--accent)' : 'var(--border)', background: budgetFilter === val ? 'var(--accent-dim)' : 'transparent', color: budgetFilter === val ? 'var(--accent)' : 'var(--text-secondary)', fontSize: '12px', cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
      )}

      {tab === 'gigs' && (
        gigsLoading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading gigs...</div>
        ) : gigs && gigs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
            {gigs.map((gig) => <GigCard key={gig.id} gig={gig} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', opacity: 0.4 }}><ShoppingBagIcon /></div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>No gigs yet</div>
            <div style={{ fontSize: '13px' }}>{user?.is_developer ? 'Be the first to post a gig.' : 'Check back soon.'}</div>
          </div>
        )
      )}

      {tab === 'jobs' && (
        jobsLoading ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading jobs...</div>
        ) : jobs && jobs.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
            {jobs.map((job) => <JobCard key={job.id} job={job} onClick={() => navigate('/marketplace/jobs/' + job.id)} />)}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px', opacity: 0.4 }}><BriefcaseIcon /></div>
            <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>No jobs posted yet</div>
            <div style={{ fontSize: '13px' }}>Be the first to post a job.</div>
          </div>
        )
      )}
    </div>
  )
}