import { useState } from "react"
import { useGigs, useJobs } from "../../hooks/useMarketplace"
import GigCard from "../../components/marketplace/GigCard"
import JobCard from "../../components/marketplace/JobCard"
import Button from "../../components/ui/Button"

export default function MarketplacePage() {
  const [tab, setTab] = useState("gigs")
  const { data: gigs, isLoading: gigsLoading } = useGigs()
  const { data: jobs, isLoading: jobsLoading } = useJobs()

  const tabStyle = (t) => ({
    padding: "var(--space-2) var(--space-5)",
    borderRadius: "var(--radius-full)",
    fontSize: "var(--text-sm)",
    fontWeight: 600,
    cursor: "pointer",
    border: "none",
    background: tab === t ? "var(--accent)" : "transparent",
    color: tab === t ? "#0a0a0a" : "var(--text-secondary)",
    transition: "all var(--transition)",
  })

  return (
    <div style={{ padding: "var(--space-6)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-6)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-2xl)", fontWeight: 700, color: "var(--text-primary)" }}>Marketplace</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginTop: "var(--space-1)" }}>Browse gigs or post a job</p>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <Button variant="ghost">Post a Job</Button>
          <Button>Create Gig</Button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-6)", background: "var(--bg-secondary)", padding: "var(--space-1)", borderRadius: "var(--radius-full)", width: "fit-content" }}>
        <button style={tabStyle("gigs")} onClick={() => setTab("gigs")}>Gigs</button>
        <button style={tabStyle("jobs")} onClick={() => setTab("jobs")}>Jobs</button>
        <button style={tabStyle("contracts")} onClick={() => setTab("contracts")}>Contracts</button>
      </div>

      {tab === "gigs" && (
        <div>
          {gigsLoading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading gigs...</p>
          ) : gigs?.results?.length === 0 || !gigs?.results ? (
            <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>No gigs yet</p>
              <p style={{ fontSize: "var(--text-sm)" }}>Be the first to create one</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-4)" }}>
              {(gigs?.results || gigs || []).map((gig) => (
                <GigCard key={gig.id} gig={gig} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "jobs" && (
        <div>
          {jobsLoading ? (
            <p style={{ color: "var(--text-muted)" }}>Loading jobs...</p>
          ) : !jobs?.results && !jobs?.length ? (
            <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>No jobs posted yet</p>
              <p style={{ fontSize: "var(--text-sm)" }}>Post a job to get bids from developers</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "var(--space-4)" }}>
              {(jobs?.results || jobs || []).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "contracts" && (
        <div style={{ textAlign: "center", padding: "var(--space-16)", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "var(--text-lg)" }}>Your contracts will appear here</p>
        </div>
      )}
    </div>
  )
}
