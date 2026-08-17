import { useRef, useEffect } from 'react'
import Editor from '@monaco-editor/react'

const LANG_MAP = {
  plaintext: 'plaintext', python: 'python', javascript: 'javascript',
  typescript: 'typescript', jsx: 'javascript', tsx: 'typescript',
  html: 'html', css: 'css', json: 'json', bash: 'shell', sql: 'sql', markdown: 'markdown',
}

export default function CodeEditor({ content, language, onChange, onSave }) {
  const editorRef = useRef(null)

  const handleMount = (editor, monaco) => {
    editorRef.current = editor
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSave(editor.getValue())
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1 }}>
        <Editor
          height="100%"
          language={LANG_MAP[language] || 'plaintext'}
          value={content || ''}
          theme="vs-dark"
          onMount={handleMount}
          onChange={(val) => onChange(val || '')}
          options={{
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
          }}
        />
      </div>
      <div style={{
        padding: '6px 16px', borderTop: '1px solid var(--border)',
        background: 'var(--bg-secondary)', fontSize: '0.75rem',
        color: 'var(--text-muted)', display: 'flex', justifyContent: 'space-between',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{language}</span>
        <span>Ctrl+S to save</span>
      </div>
    </div>
  )
}