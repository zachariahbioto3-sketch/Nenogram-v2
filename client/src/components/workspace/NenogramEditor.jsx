import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useRef } from 'react'

export default function NenogramEditor({ content, onChange }) {
  const debounceRef = useRef(null)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: content || '',
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => onChange(html), 1500)
    },
  })

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const btn = (action, label, isActive) => (
    <button
      onClick={action}
      style={{
        background: isActive ? 'var(--accent-dim)' : 'none',
        color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
        border: 'none', borderRadius: 'var(--radius-sm)',
        padding: '4px 10px', cursor: 'pointer', fontSize: '0.82rem',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{
        display: 'flex', gap: 4, padding: '8px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-secondary)', flexWrap: 'wrap',
      }}>
        {btn(() => editor?.chain().focus().toggleBold().run(), 'B', editor?.isActive('bold'))}
        {btn(() => editor?.chain().focus().toggleItalic().run(), 'I', editor?.isActive('italic'))}
        {btn(() => editor?.chain().focus().toggleStrike().run(), 'S', editor?.isActive('strike'))}
        {btn(() => editor?.chain().focus().toggleCode().run(), '<>', editor?.isActive('code'))}
        {btn(() => editor?.chain().focus().toggleHeading({ level: 1 }).run(), 'H1', editor?.isActive('heading', { level: 1 }))}
        {btn(() => editor?.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor?.isActive('heading', { level: 2 }))}
        {btn(() => editor?.chain().focus().toggleBulletList().run(), 'UL', editor?.isActive('bulletList'))}
        {btn(() => editor?.chain().focus().toggleOrderedList().run(), 'OL', editor?.isActive('orderedList'))}
        {btn(() => editor?.chain().focus().toggleBlockquote().run(), 'Quote', editor?.isActive('blockquote'))}
        {btn(() => editor?.chain().focus().toggleCodeBlock().run(), 'Code Block', editor?.isActive('codeBlock'))}
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>
        <EditorContent editor={editor} style={{ minHeight: '100%', outline: 'none' }} />
      </div>
      <div style={{
        padding: '6px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)', fontSize: '0.75rem',
        color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{editor?.storage.characterCount?.words?.() ?? 0} words</span>
        <span>Rich Text</span>
      </div>
    </div>
  )
}