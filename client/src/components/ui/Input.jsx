export default function Input({ label, error, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
      {label && (
        <label style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: 500 }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          background: "var(--bg-tertiary)",
          border: "1px solid " + (error ? "var(--danger)" : "var(--border)"),
          borderRadius: "var(--radius-md)",
          padding: "var(--space-3) var(--space-4)",
          color: "var(--text-primary)",
          fontSize: "var(--text-base)",
          outline: "none",
          width: "100%",
        }}
        onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.target.style.borderColor = error ? "var(--danger)" : "var(--border)")}
      />
      {error && (
        <span style={{ fontSize: "var(--text-xs)", color: "var(--danger)" }}>{error}</span>
      )}
    </div>
  )
}
