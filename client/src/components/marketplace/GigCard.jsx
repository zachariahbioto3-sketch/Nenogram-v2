export default function GigCard({ gig, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(gig)}
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-5)",
        cursor: "pointer",
        transition: "border-color var(--transition), box-shadow var(--transition)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-accent)"
        e.currentTarget.style.boxShadow = "var(--shadow-accent)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)"
        e.currentTarget.style.boxShadow = "none"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
        <div style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", background: "var(--accent-dim)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "var(--text-sm)", color: "var(--accent)", fontWeight: 700 }}>
          {gig.developer?.username?.[0]?.toUpperCase()}
        </div>
        <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>{gig.developer?.username}</span>
        {gig.developer?.is_developer && (
          <span style={{ fontSize: "var(--text-xs)", background: "var(--accent-dim)", color: "var(--accent)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>DEV</span>
        )}
      </div>
      <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)", lineHeight: 1.4 }}>{gig.title}</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-4)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{gig.description}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--text-lg)", fontWeight: 700, color: "var(--accent)" }}>
          {gig.currency_type === "nenocoin" ? "NC " : ""}{gig.price}
        </span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{gig.delivery_days}d delivery</span>
      </div>
    </div>
  )
}
