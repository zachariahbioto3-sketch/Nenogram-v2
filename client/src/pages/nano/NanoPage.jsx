import { useState } from 'react'
import { useNanos, useCreateNano, useUpdateNano, useDeleteNano } from '../../hooks/useNano'

const LANGUAGES = ['plain','python','javascript','typescript','html','css','json','markdown','bash','sql']

const langDot = { python: '#3572A5', javascript: '#f1c21b', typescript: '#3178c6', html: '#e34c26', css: '#563d7c', json: '#6b7280', markdown: '#083fa1', bash: '#22c55e', sql: '#e38c00', plain: '#9ca3af' }

const PlusIcon = () => (
  <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
    <line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/>
  </svg>
)

function NanoEditor({ nano, onClose }) {
  const { mutate: create, isPending: creating } = useCreateNano()
  const { mutate: update, isPending: updating } = useUpdateNano()
  const isEdit = !!nano

  const [title,      setTitle]      = useState(nano?.title      || 'Untitled')
  const [content,    setContent]    = useState(nano?.content    || '')
  const [language,   setLanguage]   = useState(nano?.language   || 'plain')
  const [visibility, setVisibility] = useState(nano?.visibility || 'private')

  const handleSave = () => {
    const data = { title, content, language, visibility }
    if (isEdit) update({ slug: nano.slug, data }, { onSuccess: onClose })
    else create(data, { onSuccess: onClose })
  }

  const isPending = creating || updating

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '700px',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        boxShadow: 'var(--shadow-lg)',
      }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            style={{
              flex: 1, minWidth: '160px', background: 'transparent', border: 'none', outline: 'none',
              fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-sans)',
            }}
          />
          <select value={language} onChange={e => setLanguage(e.target.value)} style={{
            padding: '5px 10px', background: 'var(--bg-tertiary)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', fontSize: '12px',
            fontFamily: 'var(--font-mono)', cursor: 'pointer', outline: 'none',
          }}>
            {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => setVisibility(v => v === 'public' ? 'private' : 'public')} style={{
            padding: '5px 12px',
            background: visibility === 'public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
            border: '1px solid ' + (visibility === 'public' ? 'var(--border-accent)' : 'var(--border)'),
            borderRadius: 'var(--radius-md)',
            color: visibility === 'public' ? 'var(--accent)' : 'var(--text-muted)',
            fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer', fontWeight: 500,
          }}>
            {visibility}
          </button>
        </div>

        {/* Body */}
        <textarea
          value={content} onChange={e => setContent(e.target.value)}
          placeholder='Start writing...'
          spellCheck={false}
          style={{
            flex: 1, padding: '20px', background: 'transparent', border: 'none',
            outline: 'none', resize: 'none', color: 'var(--text-primary)',
            fontSize: '13px', fontFamily: 'var(--font-mono)', lineHeight: 1.8,
            minHeight: '340px',
          }}
        />

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} style={{
            padding: '9px 18px', background: 'transparent',
            border: '1px solid var(--border-strong)', borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
          }}>Cancel</button>
          <button onClick={handleSave} disabled={isPending} style={{
            padding: '9px 22px', background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius-md)', color: '#ffffff',
            fontWeight: 600, fontSize: '13px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.65 : 1,
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 2px 8px rgba(232,160,32,0.28)',
          }}>
            {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NanoCard({ nano, onEdit, onDelete }) {
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)', padding: '18px',
      display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'border-color var(--transition), box-shadow var(--transition)',
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-accent)'; e.currentTarget.style.boxShadow = 'var(--shadow-accent)' }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'none' }}>

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{nano.title}</span>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => onEdit(nano)} style={{
            fontSize: '11px', padding: '3px 10px',
            background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>edit</button>
          <button onClick={() => onDelete(nano.slug)} style={{
            fontSize: '11px', padding: '3px 10px',
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)', color: 'var(--danger)',
            cursor: 'pointer', fontFamily: 'var(--font-sans)',
          }}>del</button>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: langDot[nano.language] ?? '#9ca3af', display: 'inline-block', flexShrink: 0 }} />
          {nano.language}
        </span>
        <span style={{
          fontSize: '10px', fontFamily: 'var(--font-mono)', fontWeight: 500,
          background: nano.visibility === 'public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
          color: nano.visibility === 'public' ? 'var(--accent)' : 'var(--text-muted)',
          border: '1px solid ' + (nano.visibility === 'public' ? 'var(--border-accent)' : 'var(--border)'),
          borderRadius: 'var(--radius-full)', padding: '2px 8px',
        }}>{nano.visibility}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto', fontFamily: 'var(--font-mono)' }}>
          {new Date(nano.updated_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  )
}

export default function NanoPage() {
  const { data: nanos, isLoading } = useNanos()
  const { mutate: deleteNano } = useDeleteNano()
  const [editor, setEditor]     = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const openNew  = () => { setEditor(null);  setShowEditor(true) }
  const openEdit = (nano) => { setEditor(nano); setShowEditor(true) }
  const closeEditor = () => { setEditor(null); setShowEditor(false) }
  const handleDelete = (slug) => { if (window.confirm('Delete this nano?')) deleteNano(slug) }

  return (
    <div style={{ maxWidth: '900px' }}>
      {showEditor && <NanoEditor nano={editor} onClose={closeEditor} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.3px', marginBottom: '4px' }}>Nano</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Snippets, notes, and quick documents.</p>
        </div>
        <button onClick={openNew} style={{
          display: 'flex', alignItems: 'center', gap: '7px',
          padding: '10px 18px', background: 'var(--accent)', border: 'none',
          borderRadius: 'var(--radius-md)', color: '#ffffff',
          fontWeight: 600, fontSize: '13px', cursor: 'pointer',
          fontFamily: 'var(--font-sans)',
          boxShadow: '0 2px 8px rgba(232,160,32,0.28)',
        }}>
          <PlusIcon /> New Nano
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>
      ) : nanos && nanos.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '12px' }}>
          {nanos.map(nano => <NanoCard key={nano.slug} nano={nano} onEdit={openEdit} onDelete={handleDelete} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <div style={{
            width: '54px', height: '54px', borderRadius: '16px',
            background: 'var(--accent-dim)', border: '1px solid var(--border-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', color: 'var(--accent)',
          }}>
            <svg width='22' height='22' fill='none' stroke='currentColor' strokeWidth='1.8' viewBox='0 0 24 24'>
              <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/>
              <polyline points='14 2 14 8 20 8'/>
            </svg>
          </div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px' }}>No nanos yet</div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '22px' }}>Create your first snippet or note.</div>
          <button onClick={openNew} style={{
            padding: '10px 22px', background: 'var(--accent)', border: 'none',
            borderRadius: 'var(--radius-md)', color: '#ffffff',
            fontWeight: 600, fontSize: '13px', cursor: 'pointer',
            fontFamily: 'var(--font-sans)',
            boxShadow: '0 2px 10px rgba(232,160,32,0.28)',
          }}>Create Nano</button>
        </div>
      )}
    </div>
  )
}
