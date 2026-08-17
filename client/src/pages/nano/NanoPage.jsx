import { useState } from 'react'
import { useNanos, useCreateNano, useUpdateNano, useDeleteNano } from '../../hooks/useNano'

const LANGUAGES = ['plain', 'python', 'javascript', 'typescript', 'html', 'css', 'json', 'markdown', 'bash', 'sql']

const langColor = (lang) => {
  const map = { python: '#3572A5', javascript: '#f1e05a', typescript: '#3178c6', html: '#e34c26', css: '#563d7c', json: '#292929', markdown: '#083fa1', bash: '#89e051', sql: '#e38c00', plain: '#555' }
  return map[lang] || '#555'
}

function NanoEditor({ nano, onClose }) {
  const { mutate: create, isPending: creating } = useCreateNano()
  const { mutate: update, isPending: updating } = useUpdateNano()
  const isEdit = !!nano
  const [title, setTitle] = useState(nano?.title || 'Untitled')
  const [content, setContent] = useState(nano?.content || '')
  const [language, setLanguage] = useState(nano?.language || 'plain')
  const [visibility, setVisibility] = useState(nano?.visibility || 'private')

  const handleSave = () => {
    const data = { title, content, language, visibility }
    if (isEdit) {
      update({ slug: nano.slug, data }, { onSuccess: onClose })
    } else {
      create(data, { onSuccess: onClose })
    }
  }

  const isPending = creating || updating

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>

        {/* Toolbar */}
        <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ flex: 1, minWidth: '140px', background: 'transparent', border: 'none', outline: 'none', fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} style={{ padding: '5px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', fontSize: '12px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <button onClick={() => setVisibility(v => v === 'public' ? 'private' : 'public')} style={{ padding: '5px 10px', background: visibility === 'public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)', border: '1px solid', borderColor: visibility === 'public' ? 'var(--border-accent)' : 'var(--border)', borderRadius: 'var(--radius-sm)', color: visibility === 'public' ? 'var(--accent)' : 'var(--text-muted)', fontSize: '11px', fontFamily: 'var(--font-mono)', cursor: 'pointer' }}>
            {visibility}
          </button>
        </div>

        {/* Editor */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder='Start writing...'
          spellCheck={false}
          style={{ flex: 1, padding: '18px', background: 'transparent', border: 'none', outline: 'none', resize: 'none', color: 'var(--text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)', lineHeight: 1.7, minHeight: '320px' }}
        />

        {/* Footer */}
        <div style={{ padding: '12px 18px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handleSave} disabled={isPending} style={{ padding: '8px 20px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: isPending ? 'not-allowed' : 'pointer', opacity: isPending ? 0.7 : 1 }}>
            {isPending ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NanoCard({ nano, onEdit, onDelete }) {
  return (
    <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>{nano.title}</div>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button onClick={() => onEdit(nano)} style={{ fontSize: '11px', padding: '3px 8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>edit</button>
          <button onClick={() => onDelete(nano.slug)} style={{ fontSize: '11px', padding: '3px 8px', background: 'transparent', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--danger)', cursor: 'pointer' }}>del</button>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: langColor(nano.language), display: 'inline-block' }} />
          {nano.language}
        </span>
        <span style={{ fontSize: '10px', color: nano.visibility === 'public' ? 'var(--accent)' : 'var(--text-muted)', fontFamily: 'var(--font-mono)', background: nano.visibility === 'public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)', padding: '1px 6px', borderRadius: 'var(--radius-sm)', border: '1px solid', borderColor: nano.visibility === 'public' ? 'var(--border-accent)' : 'var(--border)' }}>
          {nano.visibility}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {new Date(nano.updated_at).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </div>
  )
}

export default function NanoPage() {
  const { data: nanos, isLoading } = useNanos()
  const { mutate: deleteNano } = useDeleteNano()
  const [editor, setEditor] = useState(null)
  const [showEditor, setShowEditor] = useState(false)

  const openNew = () => { setEditor(null); setShowEditor(true) }
  const openEdit = (nano) => { setEditor(nano); setShowEditor(true) }
  const closeEditor = () => { setEditor(null); setShowEditor(false) }

  const handleDelete = (slug) => {
    if (window.confirm('Delete this nano?')) deleteNano(slug)
  }

  return (
    <div>
      {showEditor && <NanoEditor nano={editor} onClose={closeEditor} />}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div>
          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>your nanos</div>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>snippets, notes, and documents</div>
        </div>
        <button onClick={openNew} style={{ padding: '9px 18px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>+ New Nano</button>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Loading...</div>
      ) : nanos && nanos.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
          {nanos.map((nano) => <NanoCard key={nano.slug} nano={nano} onEdit={openEdit} onDelete={handleDelete} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📄</div>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>No nanos yet</div>
          <div style={{ fontSize: '13px', marginBottom: '20px' }}>Create your first snippet or note.</div>
          <button onClick={openNew} style={{ padding: '9px 20px', background: 'var(--accent)', border: 'none', borderRadius: 'var(--radius-md)', color: '#0a0a0a', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}>Create Nano</button>
        </div>
      )}
    </div>
  )
}
