import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { useEffect, useRef, useState } from "react";
import { nanoAPI } from "../../api/nano";

const Btn = ({ onClick, active, title, children, danger }) => (
  <button
    title={title}
    onMouseDown={(e) => { e.preventDefault(); onClick(); }}
    style={{
      background: active ? "var(--accent-dim)" : "none",
      color: danger ? "var(--danger)" : active ? "var(--accent)" : "var(--text-secondary)",
      border: "none", borderRadius: "var(--radius-sm)",
      padding: "4px 9px", cursor: "pointer", fontSize: "0.8rem",
      fontFamily: "var(--font-sans)", lineHeight: 1,
      display: "flex", alignItems: "center", gap: 3,
    }}
  >{children}</button>
);

const Divider = () => (
  <span style={{ width: 1, background: "var(--border)", alignSelf: "stretch", margin: "2px 4px" }} />
);

function LinkModal({ onConfirm, onClose, initial }) {
  const [val, setVal] = useState(initial || "");
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 900 }}>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: 24, width: "100%", maxWidth: 380 }}>
        <p style={{ margin: "0 0 12px", color: "var(--text-primary)", fontWeight: 600, fontSize: 14 }}>Insert Link</p>
        <input autoFocus value={val} onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") onConfirm(val); if (e.key === "Escape") onClose(); }}
          placeholder="https://example.com"
          style={{ width: "100%", boxSizing: "border-box", background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", color: "var(--text-primary)", padding: "8px 10px", fontSize: 13, marginBottom: 16 }} />
        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "var(--bg-tertiary)", color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "7px 14px", cursor: "pointer", fontSize: 13 }}>Cancel</button>
          <button onClick={() => onConfirm(val)} style={{ background: "var(--accent)", color: "#fff", border: "none", borderRadius: "var(--radius-sm)", padding: "7px 14px", fontWeight: 600, cursor: "pointer", fontSize: 13 }}>Apply</button>
        </div>
      </div>
    </div>
  );
}

export default function NenogramEditor({ content, onChange, fileId }) {
  const debounceRef  = useRef(null);
  const imageInputRef = useRef(null);
  const fileIdRef    = useRef(fileId);
  const mountedRef   = useRef(false);
  const [linkModal, setLinkModal]   = useState(false);
  const [uploading, setUploading]   = useState(false);

  useEffect(() => { mountedRef.current = true; return () => { mountedRef.current = false; }; }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // disable extensions that StarterKit v3 now bundles so we can configure them ourselves
        link: false,
        underline: false,
      }),
      Placeholder.configure({ placeholder: "Start writing..." }),
      Underline,
      Highlight.configure({ multicolor: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false, allowBase64: false }),
      CharacterCount,
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => onChange(html), 1500);
    },
  });

  // sync content when switching files
  useEffect(() => {
    if (!editor) return;
    if (fileIdRef.current === fileId) return;
    fileIdRef.current = fileId;
    editor.commands.setContent(content || "");
  }, [fileId, editor]);

  useEffect(() => {
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, []);

  const handleImageFile = async (file) => {
    if (!file || !editor || !fileId) return;
    setUploading(true);
    try {
      const data = await nanoAPI.uploadInlineImage(file);
      editor.chain().focus().setImage({ src: data.url }).run();
    } finally {
      setUploading(false);
    }
  };

  const handleLinkConfirm = (url) => {
    setLinkModal(false);
    if (!url) { editor.chain().focus().unsetLink().run(); return; }
    editor.chain().focus().setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "var(--text-muted)", fontSize: 13 }}>
        Loading editor...
      </div>
    );
  }

  const words = editor.storage?.characterCount?.words?.() ?? 0;
  const chars  = editor.storage?.characterCount?.characters?.() ?? 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <input ref={imageInputRef} type="file" accept="image/*" style={{ display: "none" }}
        onChange={(e) => { if (e.target.files[0]) handleImageFile(e.target.files[0]); e.target.value = ""; }} />

      {/* Toolbar */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "6px 12px", borderBottom: "1px solid var(--border)", background: "var(--bg-secondary)", flexWrap: "wrap" }}>
        <Btn onClick={() => editor.chain().focus().toggleBold().run()}      active={editor.isActive("bold")}      title="Bold"><b>B</b></Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()}    active={editor.isActive("italic")}    title="Italic"><i>I</i></Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline"><u>U</u></Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()}    active={editor.isActive("strike")}    title="Strike"><s>S</s></Btn>
        <Btn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive("highlight")} title="Highlight">▐</Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="H1">H1</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="H2">H2</Btn>
        <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="H3">H3</Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()}  active={editor.isActive("bulletList")}  title="Bullet List">• UL</Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Ordered List">1. OL</Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()}  active={editor.isActive("blockquote")} title="Blockquote">❝</Btn>
        <Btn onClick={() => editor.chain().focus().toggleCode().run()}        active={editor.isActive("code")}       title="Inline Code">`c`</Btn>
        <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()}   active={editor.isActive("codeBlock")}  title="Code Block">{"</>"}</Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">―</Btn>

        <Divider />

        <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()}   active={editor.isActive({ textAlign: "left" })}   title="Align Left">⬅</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align Center">☰</Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()}  active={editor.isActive({ textAlign: "right" })}  title="Align Right">➡</Btn>

        <Divider />

        <Btn onClick={() => setLinkModal(true)} active={editor.isActive("link")} title="Insert Link">🔗</Btn>
        {editor.isActive("link") && (
          <Btn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link" danger>✕ link</Btn>
        )}
        <Btn onClick={() => fileId ? imageInputRef.current?.click() : null} title={fileId ? "Insert Image" : "Save file first"}>
          {uploading ? "⏳" : "🖼"}
        </Btn>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
        <EditorContent editor={editor} style={{ minHeight: "100%", outline: "none" }} />
      </div>

      {/* Status bar */}
      <div style={{ padding: "5px 16px", borderTop: "1px solid var(--border)", background: "var(--bg-secondary)", fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", gap: 16 }}>
        <span>{words} words</span>
        <span>{chars} characters</span>
      </div>

      {linkModal && <LinkModal onConfirm={handleLinkConfirm} onClose={() => setLinkModal(false)} initial={editor.getAttributes("link").href} />}
    </div>
  );
}
