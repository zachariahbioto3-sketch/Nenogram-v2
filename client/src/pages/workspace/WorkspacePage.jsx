import { useState, lazy, Suspense } from 'react'
import { useFolders, useFiles, useFile, useCreateFolder, useCreateFile, useUpdateFile, useDeleteFolder, useDeleteFile } from '../../hooks/useWorkspace'

const NenogramEditor = lazy(() => import('../../components/workspace/NenogramEditor'))
const CodeEditor = lazy(() => import('../../components/workspace/CodeEditor'))

const FILE_ICONS = {
  richtext: '📄',
  code: '💻',
}

const LANG_CHOICES = [
  'plaintext','python','javascript','typescript','jsx','tsx','html','css','json','bash','sql','markdown'
]

const TYPE_COLORS = {
  richtext: 'var(--accent)',
  code: 'var(--success)',
}

function NewFileModal({ currentFolderId, onClose, onCreate }) {
  const [name, setName] = useState('')
  const [fileType, setFileType] = useState('richtext')
  const [language, setLanguage] = useState('plaintext')
  const createFile = useCreateFile()

  const handle = () => {
    if (!name.trim()) return
    const data = { name: name.trim(), file_type: fileType, language, content: '' }
    if (currentFolderId) data.folder = currentFolderId
    createFile.mutate(data, {
      onSuccess: (res) => { onCreate(res.data); onClose() }
    })
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: 420 }}>
        <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>New File</h3>
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>File Name</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder='Untitled'
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-3)', fontSize: '0.9rem' }} />
        <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>Type</label>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          {['richtext', 'code'].map(t => (
            <button key={t} onClick={() => setFileType(t)}
              style={{ flex: 1, background: fileType === t ? 'var(--accent-dim)' : 'var(--bg-tertiary)', color: fileType === t ? 'var(--accent)' : 'var(--text-secondary)', border: `1px solid ${fileType === t ? 'var(--border-accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-sm)', padding: '8px', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>
              {t === 'richtext' ? 'Rich Text' : 'Code'}
            </button>
          ))}
        </div>
        {fileType === 'code' && (
          <>
            <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: 4 }}>Language</label>
            <select value={language} onChange={e => setLanguage(e.target.value)}
              style={{ width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-3)', fontSize: '0.9rem' }}>
              {LANG_CHOICES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </>
        )}
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
          <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handle} disabled={createFile.isPending}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            {createFile.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

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
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-6)', width: '100%', maxWidth: 380 }}>
        <h3 style={{ margin: '0 0 var(--space-4)', color: 'var(--text-primary)' }}>New Folder</h3>
        <input value={name} onChange={e => setName(e.target.value)} placeholder='Folder name'
          style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 10px', marginBottom: 'var(--space-4)', fontSize: '0.9rem' }} />
        <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '8px 16px', cursor: 'pointer' }}>Cancel</button>
          <button onClick={handle} disabled={createFolder.isPending}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 16px', fontWeight: 600, cursor: 'pointer' }}>
            {createFolder.isPending ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  )
}

function EditorView({ fileId, onBack }) {
  const { data: file, isLoading } = useFile(fileId)
  const updateFile = useUpdateFile()
  const [saveStatus, setSaveStatus] = useState('saved')
  const [localContent, setLocalContent] = useState(null)
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState('')

  const handleChange = (val) => {
    setLocalContent(val)
    setSaveStatus('unsaved')
  }

  const handleSave = (val) => {
    const content = val !== undefined ? val : localContent
    if (content === null) return
    setSaveStatus('saving...')
    updateFile.mutate({ id: fileId, data: { content } }, {
      onSuccess: () => setSaveStatus('saved'),
      onError: () => setSaveStatus('error'),
    })
  }

  const handleRename = () => {
    if (!nameVal.trim() || nameVal === file.name) { setEditingName(false); return }
    updateFile.mutate({ id: fileId, data: { name: nameVal } }, {
      onSuccess: () => setEditingName(false),
    })
  }

  if (isLoading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>Loading...</div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: '10px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
        <button onClick={onBack}
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.1rem', padding: '4px 8px', borderRadius: 'var(--radius-sm)' }}>
          ←
        </button>
        {editingName ? (
          <input value={nameVal} onChange={e => setNameVal(e.target.value)}
            onBlur={handleRename} onKeyDown={e => e.key === 'Enter' && handleRename()}
            autoFocus
            style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '4px 8px', fontSize: '0.95rem', fontWeight: 600 }} />
        ) : (
          <span onClick={() => { setEditingName(true); setNameVal(file.name) }}
            style={{ color: 'var(--text-primary)', fontWeight: 600, cursor: 'text', fontSize: '0.95rem' }}>
            {file.name}
          </span>
        )}
        <span style={{ marginLeft: 'auto', color: saveStatus === 'saved' ? 'var(--success)' : saveStatus === 'error' ? 'var(--danger)' : 'var(--text-muted)', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
          {saveStatus}
        </span>
        {file.file_type === 'richtext' && saveStatus === 'unsaved' && (
          <button onClick={() => handleSave()}
            style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '5px 12px', fontWeight: 600, cursor: 'pointer', fontSize: '0.82rem' }}>
            Save
          </button>
        )}
      </div>
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <Suspense fallback={<div style={{ padding: 32, color: 'var(--text-muted)' }}>Loading editor...</div>}>
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

function FileManagerView({ onOpenFile }) {
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [breadcrumb, setBreadcrumb] = useState([{ id: null, name: 'Files' }])
  const [search, setSearch] = useState('')
  const [showNewFile, setShowNewFile] = useState(false)
  const [showNewFolder, setShowNewFolder] = useState(false)
  const [contextMenu, setContextMenu] = useState(null)

  const { data: folders } = useFolders(currentFolderId)
  const { data: files } = useFiles(currentFolderId)
  const deleteFolder = useDeleteFolder()
  const deleteFile = useDeleteFile()

  const folderList = folders?.results || folders || []
  const fileList = files?.results || files || []

  const filteredFolders = folderList.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
  const filteredFiles = fileList.filter(f => f.name.toLowerCase().includes(search.toLowerCase()))

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

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-primary)', position: 'relative' }}
      onClick={() => setContextMenu(null)}>
      <div style={{ width: 220, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', padding: 'var(--space-4)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-6)', padding: 'var(--space-2)' }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#131313', fontWeight: 700, fontSize: '0.85rem' }}>W</div>
          <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem' }}>Workspace</span>
        </div>
        {[{ icon: '📁', label: 'Files', active: true }, { icon: '⚙️', label: 'Settings', active: false }].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', background: item.active ? 'var(--accent-dim)' : 'none', color: item.active ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', marginBottom: 4, fontSize: '0.88rem' }}>
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: 'var(--space-4) var(--space-5)', borderBottom: '1px solid var(--border)', background: 'var(--bg-secondary)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              {breadcrumb.map((b, i) => (
                <span key={b.id ?? 'root'} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {i > 0 && <span style={{ color: 'var(--text-muted)' }}>/</span>}
                  <span onClick={() => goToBreadcrumb(b)}
                    style={{ color: i === breadcrumb.length - 1 ? 'var(--text-primary)' : 'var(--accent)', cursor: 'pointer', fontWeight: i === breadcrumb.length - 1 ? 700 : 400, fontSize: '1.1rem' }}>
                    {b.name}
                  </span>
                </span>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button onClick={() => setShowNewFolder(true)}
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '7px 14px', cursor: 'pointer', fontSize: '0.85rem' }}>
                + Folder
              </button>
              <button onClick={() => setShowNewFile(true)}
                style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '7px 14px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>
                + New File
              </button>
            </div>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search files...'
            style={{ width: '100%', boxSizing: 'border-box', background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', padding: '8px 12px', fontSize: '0.9rem' }} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)' }}>
          {filteredFolders.length > 0 && (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)', marginTop: 0 }}>Folders</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {filteredFolders.map(folder => (
                  <div key={folder.id}
                    onDoubleClick={() => enterFolder(folder)}
                    onContextMenu={e => handleContextMenu(e, 'folder', folder)}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>📁</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: 2 }}>{folder.file_count} files</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {filteredFiles.length > 0 && (
            <>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-3)', marginTop: 0 }}>Files</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
                {filteredFiles.map(file => (
                  <div key={file.id}
                    onDoubleClick={() => onOpenFile(file.id)}
                    onContextMenu={e => handleContextMenu(e, 'file', file)}
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', cursor: 'pointer', textAlign: 'center', transition: 'var(--transition)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-2)' }}>{FILE_ICONS[file.file_type]}</div>
                    <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</div>
                    <div style={{ color: TYPE_COLORS[file.file_type], fontSize: '0.72rem', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {file.file_type === 'richtext' ? 'Rich Text' : file.language}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {filteredFolders.length === 0 && filteredFiles.length === 0 && (
            <div style={{ textAlign: 'center', padding: 'var(--space-12) 0', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 'var(--space-3)' }}>📂</div>
              <p style={{ marginBottom: 'var(--space-3)' }}>Empty workspace</p>
              <button onClick={() => setShowNewFile(true)}
                style={{ background: 'var(--accent)', color: '#131313', border: 'none', borderRadius: 'var(--radius-sm)', padding: '8px 20px', fontWeight: 600, cursor: 'pointer' }}>
                Create your first file
              </button>
            </div>
          )}
        </div>
      </div>

      {contextMenu && (
        <div style={{ position: 'fixed', top: contextMenu.y, left: contextMenu.x, background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-2)', zIndex: 1000, minWidth: 140, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
          {contextMenu.type === 'folder' && (
            <button onClick={() => { deleteFolder.mutate(contextMenu.item.id); setContextMenu(null) }}
              style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--danger)', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
              Delete Folder
            </button>
          )}
          {contextMenu.type === 'file' && (
            <>
              <button onClick={() => { onOpenFile(contextMenu.item.id); setContextMenu(null) }}
                style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--text-primary)', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                Open
              </button>
              <button onClick={() => { deleteFile.mutate(contextMenu.item.id); setContextMenu(null) }}
                style={{ display: 'block', width: '100%', background: 'none', border: 'none', color: 'var(--danger)', padding: '8px 12px', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', borderRadius: 'var(--radius-sm)' }}>
                Delete
              </button>
            </>
          )}
        </div>
      )}

      {showNewFile && <NewFileModal currentFolderId={currentFolderId} onClose={() => setShowNewFile(false)} onCreate={(file) => onOpenFile(file.id)} />}
      {showNewFolder && <NewFolderModal currentFolderId={currentFolderId} onClose={() => setShowNewFolder(false)} />}
    </div>
  )
}

export default function WorkspacePage() {
  const [openFileId, setOpenFileId] = useState(null)

  if (openFileId) {
    return <EditorView fileId={openFileId} onBack={() => setOpenFileId(null)} />
  }

  return <FileManagerView onOpenFile={setOpenFileId} />
}