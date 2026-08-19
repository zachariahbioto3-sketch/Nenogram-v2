export default function JobCard({ job, onClick }) {
  const statusColor = {
    open: "var(--success)",
    in_progress: "var(--warning)",
    completed: "var(--text-muted)",
    cancelled: "var(--danger)",
  }
  const statusBg = {
    open: "rgba(74,222,128,0.1)",
    in_progress: "rgba(250,204,21,0.1)",
    completed: "var(--bg-tertiary)",
    cancelled: "rgba(248,113,113,0.1)",
  }
  const budget = "KES " + Number(job.budget_min).toLocaleString() + " - " + Number(job.budget_max).toLocaleString()
  const skills = Array.isArray(job.skills_required) ? job.skills_required : (job.skills_required || "").split(",").map((s) => s.trim()).filter(Boolean)

  return (
    <div
      onClick={() => onClick && onClick(job)}
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px", display: "flex", flexDirection: "column", gap: "10px", cursor: onClick ? "pointer" : "default", transition: "border-color var(--transition)" }}
      onMouseEnter={(e) => { if (onClick) e.currentTarget.style.borderColor = "var(--border-accent)" }}
      onMouseLeave={(e) => { if (onClick) e.currentTarget.style.borderColor = "var(--border)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
        <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", color: "var(--accent)", background: "var(--accent-dim)", padding: "2px 8px", borderRadius: "var(--radius-sm)" }}>{job.category}</span>
        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", background: statusBg[job.status] || "var(--bg-tertiary)", color: statusColor[job.status] || "var(--text-muted)" }}>
          {job.status?.replace("_", " ")}
        </span>
      </div>

      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.4 }}>{job.title}</div>

      <div style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
        {job.description}
      </div>

      {skills.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {skills.slice(0, 4).map((s) => (
            <span key={s} style={{ fontSize: "10px", color: "var(--text-muted)", background: "var(--bg-tertiary)", border: "1px solid var(--border)", padding: "1px 6px", borderRadius: "var(--radius-sm)" }}>{s}</span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "10px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", fontFamily: "var(--font-mono)" }}>{budget}</div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{job.bid_count ?? 0} bid{job.bid_count !== 1 ? "s" : ""}</div>
      </div>

      {job.deadline && (
        <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
          deadline: {job.deadline}
        </div>
      )}
    </div>
  )
}