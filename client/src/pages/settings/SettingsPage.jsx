import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useUpgradeDeveloper } from '../../hooks/useAuth'
import ThemePicker from '../../components/ui/ThemePicker'

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', marginBottom: '16px', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{title}</span>
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: 'var(--font-mono)' }}>{label}</div>
      <div style={{ fontSize: '14px', color: 'var(--text-primary)', padding: '9px 12px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>{value}</div>
    </div>
  )
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user)
  const { mutate: upgrade, isPending } = useUpgradeDeveloper()
  const [form, setForm] = useState({ tagline: '', skills: '', hourly_rate: '', portfolio_url: '' })
  const [errors, setErrors] = useState({})

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  const handleUpgrade = () => {
    const errs = {}
    if (!form.tagline.trim()) errs.tagline = 'Tagline is required'
    if (!form.skills.trim()) errs.skills = 'At least one skill is required'
    if (!form.hourly_rate || isNaN(form.hourly_rate) || Number(form.hourly_rate) <= 0) errs.hourly_rate = 'Valid rate required'
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    upgrade({
      tagline: form.tagline.trim(),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      hourly_rate: Number(form.hourly_rate),
      portfolio_url: form.portfolio_url.trim() || '',
    })
  }

  const inputStyle = (field) => ({
    width: '100%', padding: '9px 12px', background: 'var(--bg-tertiary)',
    border: '1px solid ' + (errors[field] ? 'var(--danger)' : 'var(--border)'),
    borderRadius: 'var(--radius-md)', color: 'var(--text-primary)',
    fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  })

  return (
    <div style={{ maxWidth: '560px' }}>

      <Section title="Appearance">
        <ThemePicker />
      </Section>

      <Section title="Account">
        <Field label="email" value={user?.email ?? '-'} />
        <Field label="username" value={user?.username ?? '-'} />
        <Field label="preferred currency" value={user?.preferred_currency ?? 'KES'} />
        <Field label="member since" value={user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'} />
      </Section>

      <Section title="Developer Profile">
        {user?.is_developer ? (
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'var(--accent-dim)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', padding: '4px 10px', marginBottom: '16px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>developer active</span>
            </div>
            <Field label="tagline" value={user.developer_profile?.tagline ?? '-'} />
            <Field label="hourly rate" value={user.developer_profile?.hourly_rate ? 'KES ' + user.developer_profile.hourly_rate + ' / hr' : '-'} />
            <Field label="skills" value={Array.isArray(user.developer_profile?.skills) ? user.developer_profile.skills.join(', ') : user.developer_profile?.skills ?? '-'} />
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.6 }}>
              Upgrade to a Developer profile to offer services on the marketplace, receive payments via escrow, and display your skills publicly.
            </p>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>tagline</label>
              <input value={form.tagline} onChange={set('tagline')} placeholder="e.g. Full-stack developer specializing in React" style={inputStyle('tagline')} />
              {errors.tagline && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>{errors.tagline}</div>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>skills (comma separated)</label>
              <input value={form.skills} onChange={set('skills')} placeholder="e.g. React, Django, PostgreSQL" style={inputStyle('skills')} />
              {errors.skills && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>{errors.skills}</div>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>hourly rate (KES)</label>
              <input type="number" value={form.hourly_rate} onChange={set('hourly_rate')} placeholder="e.g. 2500" style={inputStyle('hourly_rate')} />
              {errors.hourly_rate && <div style={{ fontSize: '11px', color: 'var(--danger)', marginTop: '4px' }}>{errors.hourly_rate}</div>}
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '5px', fontFamily: 'var(--font-mono)' }}>portfolio url (optional)</label>
              <input value={form.portfolio_url} onChange={set('portfolio_url')} placeholder="https://yourportfolio.com" style={inputStyle('portfolio_url')} />
            </div>
            <button onClick={handleUpgrade} disabled={isPending} style={{ padding: '10px 24px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
              {isPending ? 'Upgrading...' : 'Upgrade to Developer'}
            </button>
          </div>
        )}
      </Section>

    </div>
  )
}
