export default function JobCard({ job, onClick }) {
  const statusColor = {
    open: "var(--success)",
    in_progress: "var(--warning)",
    completed: "var(--text-muted)",
    cancelled: "var(--danger)",
  }
  return (
    <div
      onClick={() => onClick && onClick(job)}
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
        <span style={{ fontSize: "var(--text-xs)", color: statusColor[job.status], fontWeight: 600, textTransform: "uppercase" }}>{job.status.replace("_", " ")}</span>
        <span style={{ fontSize: "var(--text-xs)", color: "var(--text-muted)" }}>{job.bid_count} bids</span>
      </div>
      <h3 style={{ fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>{job.title}</h3>
      <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-4)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{job.description}</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--accent)" }}>
          {job.budget_min} - {job.budget_max}
        </span>
        <span style={{ fontSize: "var(--text-xs)", background: "var(--bg-tertiary)", color: "var(--text-secondary)", padding: "2px 8px", borderRadius: "var(--radius-full)" }}>{job.category}</span>
      </div>
    </div>
  )
}
