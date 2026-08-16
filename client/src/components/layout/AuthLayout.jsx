export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-6)" }}>
      <div style={{ width: "100%", maxWidth: "420px", display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
        <div>
          <div style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.5px", marginBottom: "var(--space-1)" }}>
            Nenogram
          </div>
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 600, color: "var(--text-primary)" }}>{title}</h1>
          {subtitle && (
            <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>{subtitle}</p>
          )}
        </div>
        <div style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "var(--space-8)" }}>
          {children}
        </div>
      </div>
    </div>
  )
}
