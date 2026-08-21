import { useState, lazy, Suspense } from 'react'
import {
  useFolders, useFiles, useFile,
  useCreateFolder, useDeleteFolder,
  useCreateFile, useUpdateFile, useDeleteFile,
  usePublishFile, useUnpublishFile,
} from '../../hooks/useNano'

const NenogramEditor = lazy(() => import('../../components/workspace/NenogramEditor'))
const CodeEditor     = lazy(() => import('../../components/workspace/CodeEditor'))

const LANG_CHOICES = ['plaintext','python','javascript','typescript','jsx','tsx','html','css','json','bash','sql','markdown']

const langDot = {
  python:'#3572A5', javascript:'#f1c21b', typescript:'#3178c6', jsx:'#61dafb',
  tsx:'#3178c6', html:'#e34c26', css:'#563d7c', json:'#6b7280',
  markdown:'#083fa1', bash:'#22c55e', sql:'#e38c00', plaintext:'#9ca3af',
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Icons ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
const IFolder = ({ size=20, color='var(--accent)' }) => (
  <svg width={size} height={size} fill='none' stroke={color} strokeWidth='1.5' viewBox='0 0 24 24'>
    <path d='M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z'/>
  </svg>
)
const IFileText = ({ size=20 }) => (
  <svg width={size} height={size} fill='none' stroke='var(--accent)' strokeWidth='1.5' viewBox='0 0 24 24'>
    <path d='M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z'/>
    <polyline points='14 2 14 8 20 8'/><line x1='16' y1='13' x2='8' y2='13'/><line x1='16' y1='17' x2='8' y2='17'/>
  </svg>
)
const ICode = ({ size=20 }) => (
  <svg width={size} height={size} fill='none' stroke='var(--success)' strokeWidth='1.5' viewBox='0 0 24 24'>
    <polyline points='16 18 22 12 16 6'/><polyline points='8 6 2 12 8 18'/>
  </svg>
)
const IPlus = () => (
  <svg width='14' height='14' fill='none' stroke='currentColor' strokeWidth='2.5' viewBox='0 0 24 24'>
    <line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/>
  </svg>
)
const IBack = () => (
  <svg width='16' height='16' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <polyline points='15 18 9 12 15 6'/>
  </svg>
)
const IGlobe = () => (
  <svg width='13' height='13' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <circle cx='12' cy='12' r='10'/><line x1='2' y1='12' x2='22' y2='12'/>
    <path d='M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20'/>
  </svg>
)
const ILock = () => (
  <svg width='13' height='13' fill='none' stroke='currentColor' strokeWidth='2' viewBox='0 0 24 24'>
    <rect x='3' y='11' width='18' height='11' rx='2' ry='2'/>
    <path d='M7 11V7a5 5 0 0110 0v4'/>
  </svg>
)

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Modals ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function NewFolderModal({ currentFolderId, onClose }) {
  const [name, setName] = useState('')
  const createFolder = useCreateFolder()
  const handle = () => {
    if (!name.trim()) return
    const data = { name: name.trim() }
    if (currentFolderId) data.parent = currentFolderId
    createFolder.mutate(data, { onSuccess: onClose })
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
      <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px', width:'100%', maxWidth:380 }}>
        <h3 style={{ margin:'0 0 16px', color:'var(--text-primary)', fontSize:'15px' }}>New Folder</h3>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==='Enter' && handle()} placeholder='Folder name' autoFocus
          style={{ width:'100%', boxSizing:'border-box', background:'var(--bg-tertiary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', padding:'8px 10px', marginBottom:'20px', fontSize:'14px' }} />
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ background:'var(--bg-tertiary)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'8px 16px', cursor:'pointer', fontSize:'13px' }}>Cancel</button>
          <button onClick={handle} disabled={createFolder.isPending} style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:'8px 16px', fontWeight:600, cursor:'pointer', fontSize:'13px' }}>
            {createFolder.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NewFileModal({ currentFolderId, onClose, onCreate }) {
  const [name, setName]         = useState('')
  const [fileType, setFileType] = useState('richtext')
  const [language, setLanguage] = useState('plaintext')
  const createFile = useCreateFile()
  const handle = () => {
    if (!name.trim()) return
    const data = { name: name.trim(), file_type: fileType, language, content: '' }
    if (currentFolderId) data.folder = currentFolderId
    createFile.mutate(data, { onSuccess: (res) => { onCreate(res); onClose() } })
  }
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
      <div style={{ background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'28px', width:'100%', maxWidth:420 }}>
        <h3 style={{ margin:'0 0 16px', color:'var(--text-primary)', fontSize:'15px' }}>New File</h3>
        <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'12px', marginBottom:4 }}>File Name</label>
        <input value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key==='Enter' && handle()} placeholder='Untitled' autoFocus
          style={{ width:'100%', boxSizing:'border-box', background:'var(--bg-tertiary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', padding:'8px 10px', marginBottom:'14px', fontSize:'14px' }} />
        <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'12px', marginBottom:6 }}>Type</label>
        <div style={{ display:'flex', gap:'8px', marginBottom:'14px' }}>
          {['richtext','code'].map(t => (
            <button key={t} onClick={() => setFileType(t)} style={{
              flex:1, background: fileType===t ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
              color: fileType===t ? 'var(--accent)' : 'var(--text-secondary)',
              border: '1px solid ' + (fileType===t ? 'var(--border-accent)' : 'var(--border)'),
              borderRadius:'var(--radius-sm)', padding:'8px', cursor:'pointer', fontSize:'13px',
            }}>
              {t === 'richtext' ? 'Rich Text' : 'Code'}
            </button>
          ))}
        </div>
        {fileType === 'code' && (
          <>
            <label style={{ display:'block', color:'var(--text-secondary)', fontSize:'12px', marginBottom:4 }}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              style={{ width:'100%', background:'var(--bg-tertiary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', padding:'8px 10px', marginBottom:'14px', fontSize:'13px' }}>
              {LANG_CHOICES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </>
        )}
        <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'8px' }}>
          <button onClick={onClose} style={{ background:'var(--bg-tertiary)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-sm)', padding:'8px 16px', cursor:'pointer', fontSize:'13px' }}>Cancel</button>
          <button onClick={handle} disabled={createFile.isPending} style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:'8px 16px', fontWeight:600, cursor:'pointer', fontSize:'13px' }}>
            {createFile.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Editor View ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function EditorView({ fileId, onBack }) {
  const { data: file, isLoading } = useFile(fileId)
  const updateFile   = useUpdateFile()
  const publishFile  = usePublishFile()
  const unpublishFile = useUnpublishFile()
  const [saveStatus, setSaveStatus]   = useState('saved')
  const [localContent, setLocalContent] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal]         = useState('')

  const handleChange = (val) => { setLocalContent(val); setSaveStatus('unsaved') }
  const handleSave = (val) => {
    const content = val !== undefined ? val : localContent
    if (content === null) return
    setSaveStatus('saving...')
    updateFile.mutate({ id: fileId, data: { content } }, {
      onSuccess: () => setSaveStatus('saved'),
      onError:   () => setSaveStatus('error'),
    })
  }
  const handleRename = () => {
    if (!nameVal.trim() || nameVal === file.name) { setEditingName(false); return }
    updateFile.mutate({ id: fileId, data: { name: nameVal } }, { onSuccess: () => setEditingName(false) })
  }
  const toggleVisibility = () => {
    const next = file.visibility === 'public' ? 'private' : 'public'
    if (next === 'private' && file.is_published) {
      unpublishFile.mutate(fileId)
    }
    updateFile.mutate({ id: fileId, data: { visibility: next } })
  }
  const handlePublish = () => {
    if (file.is_published) unpublishFile.mutate(fileId)
    else publishFile.mutate(fileId)
  }

  if (isLoading) return <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'var(--text-muted)', fontSize:'13px' }}>Loading...</div>

  return (
    <div onClick={onBack} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'20px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background:'var(--bg-primary)', border:'1px solid var(--border)', borderRadius:'var(--radius-xl)', width:'100%', maxWidth:'1000px', height:'85vh', display:'flex', flexDirection:'column', boxShadow:'var(--shadow-lg)', overflow:'hidden' }}>
      {/* Topbar */}
      <div style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 16px', borderBottom:'1px solid var(--border)', background:'var(--bg-secondary)', flexShrink:0, flexWrap:'wrap' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color:'var(--text-secondary)', cursor:'pointer', display:'flex', alignItems:'center', padding:'4px 6px', borderRadius:'var(--radius-sm)' }}><IBack /></button>
        {editingName ? (
          <input value={nameVal} onChange={e => setNameVal(e.target.value)} onBlur={handleRename} onKeyDown={e => e.key==='Enter' && handleRename()} autoFocus
            style={{ background:'var(--bg-tertiary)', border:'1px solid var(--border-accent)', borderRadius:'var(--radius-sm)', color:'var(--text-primary)', padding:'4px 8px', fontSize:'14px', fontWeight:600 }} />
        ) : (
          <span onClick={() => { setEditingName(true); setNameVal(file.name) }} style={{ color:'var(--text-primary)', fontWeight:600, cursor:'text', fontSize:'14px' }}>{file.name}</span>
        )}
        {/* Visibility toggle */}
        <button onClick={toggleVisibility} style={{
          display:'flex', alignItems:'center', gap:'5px',
          padding:'4px 10px', fontSize:'11px', fontFamily:'var(--font-mono)',
          background: file.visibility==='public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
          color: file.visibility==='public' ? 'var(--accent)' : 'var(--text-muted)',
          border:'1px solid ' + (file.visibility==='public' ? 'var(--border-accent)' : 'var(--border)'),
          borderRadius:'var(--radius-full)', cursor:'pointer',
        }}>
          {file.visibility === 'public' ? <IGlobe /> : <ILock />}
          {file.visibility}
        </button>
        {/* Publish button ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â only if public */}
        {file.visibility === 'public' && (
          <button onClick={handlePublish} style={{
            padding:'4px 12px', fontSize:'11px', fontWeight:600,
            background: file.is_published ? 'var(--bg-tertiary)' : 'var(--accent)',
            color: file.is_published ? 'var(--text-muted)' : '#fff',
            border:'1px solid ' + (file.is_published ? 'var(--border)' : 'transparent'),
            borderRadius:'var(--radius-full)', cursor:'pointer',
          }}>
            {file.is_published ? 'Unpublish' : 'Publish to Today'}
          </button>
        )}
        <span style={{ marginLeft:'auto', color: saveStatus==='saved' ? 'var(--success)' : saveStatus==='error' ? 'var(--danger)' : 'var(--text-muted)', fontSize:'11px', fontFamily:'var(--font-mono)' }}>{saveStatus}</span>
        {file.file_type === 'richtext' && saveStatus === 'unsaved' && (
          <button onClick={() => handleSave()} style={{ background:'var(--accent)', color:'#fff', border:'none', borderRadius:'var(--radius-sm)', padding:'5px 12px', fontWeight:600, cursor:'pointer', fontSize:'12px' }}>Save</button>
        )}
      </div>
      {/* Editor */}
      <div style={{ flex:1, overflow:'hidden' }}>
        <Suspense fallback={<div style={{ padding:32, color:'var(--text-muted)', fontSize:'13px' }}>Loading editor...</div>}>
          {file.file_type === 'richtext' ? (
            <NenogramEditor content={localContent ?? file.content} onChange={handleChange} />
          ) : (
            <CodeEditor content={localContent ?? file.content} language={file.language} onChange={handleChange} onSave={handleSave} />
          )}
        </Suspense>
      </div>
    </div>
  )
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ File Manager View ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
function FileManagerView({ onOpenFile }) {
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [breadcrumb, setBreadcrumb]           = useState([{ id: null, name: 'Nano' }])
  const [search, setSearch]                   = useState('')
  const [showNewFile, setShowNewFile]         = useState(false)
  const [showNewFolder, setShowNewFolder]     = useState(false)
  const [contextMenu, setContextMenu]         = useState(null)

  const { data: folders } = useFolders(currentFolderId)
  const { data: files }   = useFiles(currentFolderId)
  const deleteFolder = useDeleteFolder()
  const deleteFile   = useDeleteFile()
  const updateFile   = useUpdateFile()

  const folderList = Array.isArray(folders) ? folders : (folders?.results ?? [])
  const fileList   = Array.isArray(files)   ? files   : (files?.results   ?? [])
  const filteredFolders = folderList.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
  const filteredFiles   = fileList.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

  const enterFolder = (folder) => {
    setCurrentFolderId(folder.id)
    setBreadcrumb(prev => [...prev, { id: folder.id, name: folder.name }])
  }
  const goToBreadcrumb = (item) => {
    setCurrentFolderId(item.id)
    setBreadcrumb(prev => prev.slice(0, prev.findIndex(b => b.id === item.id) + 1))
  }
  const handleContextMenu = (e, type, item) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, type, item })
  }
  const toggleVisibility = (file) => {
    const next = file.visibility === 'public' ? 'private' : 'public'
    updateFile.mutate({ id: file.id, data: { visibility: next } })
    setContextMenu(null)
  }

  return (
    <div style={{ maxWidth:'960px' }} onClick={() => setContextMenu(null)}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' }}>
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'4px' }}>
            {breadcrumb.map((b, i) => (
              <span key={b.id ?? 'root'} style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                {i > 0 && <span style={{ color:'var(--text-muted)', fontSize:'13px' }}>/</span>}
                <span onClick={() => goToBreadcrumb(b)} style={{ color: i===breadcrumb.length-1 ? 'var(--text-primary)' : 'var(--accent)', cursor:'pointer', fontWeight: i===breadcrumb.length-1 ? 700 : 400, fontSize: i===0 ? '22px' : '15px', letterSpacing:'-0.3px' }}>{b.name}</span>
              </span>
            ))}
          </div>
          <p style={{ fontSize:'13px', color:'var(--text-secondary)', margin:0 }}>Files, snippets, and published articles.</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => setShowNewFolder(true)} style={{ padding:'9px 16px', background:'var(--bg-tertiary)', color:'var(--text-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', cursor:'pointer', fontSize:'13px' }}>+ Folder</button>
          <button onClick={() => setShowNewFile(true)} style={{ display:'flex', alignItems:'center', gap:'6px', padding:'9px 18px', background:'var(--accent)', color:'#fff', border:'none', borderRadius:'var(--radius-md)', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 2px 8px rgba(232,160,32,0.28)' }}>
            <IPlus /> New File
          </button>
        </div>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search files and folders...'
        style={{ width:'100%', boxSizing:'border-box', background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', color:'var(--text-primary)', padding:'10px 14px', fontSize:'13px', marginBottom:'24px', outline:'none' }} />

      {/* Folders */}
      {filteredFolders.length > 0 && (
        <>
          <p style={{ color:'var(--text-muted)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', marginTop:0 }}>Folders</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(150px, 1fr))', gap:'10px', marginBottom:'28px' }}>
            {filteredFolders.map(folder => (
              <div key={folder.id} onDoubleClick={() => enterFolder(folder)} onContextMenu={e => handleContextMenu(e,'folder',folder)}
                style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'18px 14px', cursor:'pointer', textAlign:'center', transition:'border-color var(--transition)' }}
                onMouseEnter={e => e.currentTarget.style.borderColor='var(--border-accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor='var(--border)'}>
                <div style={{ marginBottom:'8px', display:'flex', justifyContent:'center' }}><IFolder size={32} /></div>
                <div style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{folder.name}</div>
                <div style={{ color:'var(--text-muted)', fontSize:'11px', marginTop:'3px' }}>{folder.file_count} files</div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Files */}
      {filteredFiles.length > 0 && (
        <>
          <p style={{ color:'var(--text-muted)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px', marginTop:0 }}>Files</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'10px' }}>
            {filteredFiles.map(file => (
              <div key={file.id} onDoubleClick={() => onOpenFile(file.id)} onContextMenu={e => handleContextMenu(e,'file',file)}
                style={{ background:'var(--bg-secondary)', border:'1px solid var(--border)', borderRadius:'var(--radius-lg)', padding:'16px', cursor:'pointer', transition:'border-color var(--transition), box-shadow var(--transition)', display:'flex', flexDirection:'column', gap:'10px' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--border-accent)'; e.currentTarget.style.boxShadow='var(--shadow-accent)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.boxShadow='none' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  {file.file_type === 'richtext' ? <IFileText size={18} /> : <ICode size={18} />}
                  <span style={{ color:'var(--text-primary)', fontSize:'13px', fontWeight:600, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1 }}>{file.name}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:'6px', flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', fontSize:'11px', fontFamily:'var(--font-mono)', color:'var(--text-muted)' }}>
                    <span style={{ width:'6px', height:'6px', borderRadius:'50%', background: langDot[file.language] ?? '#9ca3af', display:'inline-block' }} />
                    {file.language}
                  </span>
                  <span style={{
                    display:'inline-flex', alignItems:'center', gap:'4px',
                    fontSize:'10px', fontFamily:'var(--font-mono)', fontWeight:500,
                    background: file.visibility==='public' ? 'var(--accent-dim)' : 'var(--bg-tertiary)',
                    color: file.visibility==='public' ? 'var(--accent)' : 'var(--text-muted)',
                    border:'1px solid ' + (file.visibility==='public' ? 'var(--border-accent)' : 'var(--border)'),
                    borderRadius:'var(--radius-full)', padding:'2px 7px',
                  }}>
                    {file.visibility === 'public' ? <IGlobe /> : <ILock />} {file.visibility}
                  </span>
                  {file.is_published && (
                    <span style={{ fontSize:'10px', fontFamily:'var(--font-mono)', fontWeight:500, background:'rgba(34,197,94,0.12)', color:'var(--success)', border:'1px solid rgba(34,197,94,0.25)', borderRadius:'var(--radius-full)', padding:'2px 7px' }}>published</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Empty state */}
      {filteredFolders.length === 0 && filteredFiles.length === 0 && (
        <div style={{ textAlign:'center', padding:'80px 20px' }}>
          <div style={{ width:'54px', height:'54px', borderRadius:'16px', background:'var(--accent-dim)', border:'1px solid var(--border-accent)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
            <IFileText size={22} />
          </div>
          <div style={{ fontSize:'15px', fontWeight:600, color:'var(--text-primary)', marginBottom:'6px' }}>No files yet</div>
          <div style={{ fontSize:'13px', color:'var(--text-muted)', marginBottom:'22px' }}>Create your first file or folder.</div>
          <button onClick={() => setShowNewFile(true)} style={{ padding:'10px 22px', background:'var(--accent)', border:'none', borderRadius:'var(--radius-md)', color:'#fff', fontWeight:600, fontSize:'13px', cursor:'pointer', boxShadow:'0 2px 10px rgba(232,160,32,0.28)' }}>Create File</button>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <div style={{ position:'fixed', top:contextMenu.y, left:contextMenu.x, background:'var(--bg-elevated)', border:'1px solid var(--border)', borderRadius:'var(--radius-md)', padding:'4px', zIndex:1000, minWidth:160, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
          {contextMenu.type === 'folder' && (
            <button onClick={() => { deleteFolder.mutate(contextMenu.item.id); setContextMenu(null) }} style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--danger)', padding:'8px 12px', cursor:'pointer', textAlign:'left', fontSize:'13px', borderRadius:'var(--radius-sm)' }}>Delete Folder</button>
          )}
          {contextMenu.type === 'file' && (
            <>
              <button onClick={() => { onOpenFile(contextMenu.item.id); setContextMenu(null) }} style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--text-primary)', padding:'8px 12px', cursor:'pointer', textAlign:'left', fontSize:'13px', borderRadius:'var(--radius-sm)' }}>Open</button>
              <button onClick={() => toggleVisibility(contextMenu.item)} style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--text-secondary)', padding:'8px 12px', cursor:'pointer', textAlign:'left', fontSize:'13px', borderRadius:'var(--radius-sm)' }}>
                Make {contextMenu.item.visibility === 'public' ? 'Private' : 'Public'}
              </button>
              <button onClick={() => { deleteFile.mutate(contextMenu.item.id); setContextMenu(null) }} style={{ display:'block', width:'100%', background:'none', border:'none', color:'var(--danger)', padding:'8px 12px', cursor:'pointer', textAlign:'left', fontSize:'13px', borderRadius:'var(--radius-sm)' }}>Delete</button>
            </>
          )}
        </div>
      )}

      {showNewFile   && <NewFileModal   currentFolderId={currentFolderId} onClose={() => setShowNewFile(false)}   onCreate={(file) => onOpenFile(file.id)} />}
      {showNewFolder && <NewFolderModal currentFolderId={currentFolderId} onClose={() => setShowNewFolder(false)} />}
    </div>
  )
}

// ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ Page Root ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬ÃƒÂ¢Ã¢â‚¬ÂÃ¢â€šÂ¬
export default function NanoPage() {
  const [openFileId, setOpenFileId] = useState(null)
  if (openFileId) return <EditorView fileId={openFileId} onBack={() => setOpenFileId(null)} />
  return <FileManagerView onOpenFile={setOpenFileId} />
}

