export default function GigCard({ gig, onClick }) {
  const price = gig.currency_type === "nenocoin"
    ? "NC " + Number(gig.price).toLocaleString()
    : "KES " + Number(gig.price).toLocaleString()

  return (
    <div
      onClick={() => onClick && onClick(gig)}
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px", display: "flex", flexDirection: "column", gap: "10px", cursor: onClick ? "pointer" : "default", transition: "border-color var(--transition)" }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.borderColor = "var(--border-accent)" }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.borderColor = "var(--border)" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--accent-dim)", border: "1px solid var(--border-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "11px", color: "var(--accent)", fontWeight: 700 }}>
            {gig.developer?.username?.[0]?.toUpperCase()}
          </span>
        </div>
        <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{gig.developer?.username}</span>
        {gig.developer?.is_developer && (
          <span style={{ fontSize: "10px", background: "var(--accent-dim)", color: "var(--accent)", padding: "1px 7px", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)" }}>DEV</span>
        )}
        {gig.category && (
          <span style={{ marginLeft: "auto", fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-tertiary)", padding: "1px 7px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>{gig.category?.name || gig.category}</span>
        )}
      </div>

      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{gig.title}</div>

      <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {gig.description}
      </div>

      {Array.isArray(gig.tags) && gig.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {gig.tags.slice(0, 4).map((tag) => (
            <span key={tag} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", padding: "1px 6px", borderRadius: "var(--radius-sm)" }}>{tag}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{price}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{gig.delivery_days}d delivery</div>
      </div>
    </div>
  )
}