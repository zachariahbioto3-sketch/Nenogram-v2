import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../../store/authStore"
import { useGigs, useJobs, useCreateGig, useCreateJob, useContracts } from "../../hooks/useMarketplace"
import GigCard from "../../components/marketplace/GigCard"
import JobCard from "../../components/marketplace/JobCard"

const CATEGORIES = ["web", "mobile", "api", "data", "design", "ecommerce", "automation", "other"]

const PlusIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

const BriefcaseIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <path d="M2 12h20"/>
  </svg>
)

const StoreIcon = () => (
  <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
)

function fld(err) {
  return { width: "100%", boxSizing: "border-box", padding: "9px 12px", background: "var(--bg-tertiary)", border: "1px solid " + (err ? "var(--danger)" : "var(--border)"), borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "14px", outline: "none", fontFamily: "inherit" }
}

function Lbl({ children }) {
  return <label style={{ fontSize: "11px", color: "var(--text-muted)", display: "block", marginBottom: "5px", fontFamily: "var(--font-mono)" }}>{children}</label>
}

function Err({ msg }) {
  if (!msg) return null
  return <div style={{ fontSize: "11px", color: "var(--danger)", marginTop: "3px" }}>{msg}</div>
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
      <div style={{ background: "var(--bg-elevated)", border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", padding: "28px", width: "100%", maxWidth: "480px", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>{title}</div>
        {children}
      </div>
    </div>
  )
}

function CreateGigModal({ onClose }) {
  const { mutate, isPending } = useCreateGig()
  const [form, setForm] = useState({ title: "", description: "", price: "", delivery_days: "7", tags: "", currency_type: "real" })
  const [errors, setErrors] = useState({})
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))
  const submit = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = "Required"
    if (!form.description.trim()) errs.description = "Required"
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) errs.price = "Enter a valid price"
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    mutate({ title: form.title.trim(), description: form.description.trim(), price: Number(form.price), delivery_days: Number(form.delivery_days) || 7, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), currency_type: form.currency_type }, { onSuccess: onClose })
  }
  return (
    <Modal title="Create a Gig" onClose={onClose}>
      <div style={{ marginBottom: "12px" }}><Lbl>title</Lbl><input value={form.title} onChange={set("title")} placeholder="e.g. I will build your React app" style={fld(errors.title)} /><Err msg={errors.title} /></div>
      <div style={{ marginBottom: "12px" }}><Lbl>description</Lbl><textarea value={form.description} onChange={set("description")} placeholder="Describe what you offer..." rows={4} style={{ ...fld(errors.description), resize: "vertical" }} /><Err msg={errors.description} /></div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <div style={{ flex: 1 }}><Lbl>price (KES)</Lbl><input type="number" value={form.price} onChange={set("price")} placeholder="e.g. 5000" style={fld(errors.price)} /><Err msg={errors.price} /></div>
        <div style={{ flex: 1 }}><Lbl>delivery days</Lbl><input type="number" value={form.delivery_days} onChange={set("delivery_days")} placeholder="7" style={fld()} /></div>
      </div>
      <div style={{ marginBottom: "12px" }}><Lbl>currency</Lbl><select value={form.currency_type} onChange={set("currency_type")} style={{ ...fld(), cursor: "pointer" }}><option value="real">KES (Real)</option><option value="nenocoin">NenoCoin</option></select></div>
      <div style={{ marginBottom: "20px" }}><Lbl>tags (comma separated)</Lbl><input value={form.tags} onChange={set("tags")} placeholder="e.g. react, django, mobile" style={fld()} /></div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
        <button onClick={submit} disabled={isPending} style={{ flex: 1, padding: "10px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)", color: "#0a0a0a", fontWeight: 700, fontSize: "13px", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}>{isPending ? "Creating..." : "Create Gig"}</button>
      </div>
    </Modal>
  )
}

function PostJobModal({ onClose }) {
  const { mutate, isPending } = useCreateJob()
  const [form, setForm] = useState({ title: "", description: "", category: "web", skills_required: "", budget_min: "", budget_max: "", currency_type: "real", deadline: "" })
  const [errors, setErrors] = useState({})
  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }))
  const submit = () => {
    const errs = {}
    if (!form.title.trim()) errs.title = "Required"
    if (!form.description.trim()) errs.description = "Required"
    if (!form.budget_min || isNaN(form.budget_min) || Number(form.budget_min) <= 0) errs.budget_min = "Enter a valid minimum"
    if (!form.budget_max || isNaN(form.budget_max) || Number(form.budget_max) <= 0) errs.budget_max = "Enter a valid maximum"
    if (Number(form.budget_max) < Number(form.budget_min)) errs.budget_max = "Max must be >= min"
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    mutate({ title: form.title.trim(), description: form.description.trim(), category: form.category, skills_required: form.skills_required.split(",").map((s) => s.trim()).filter(Boolean), budget_min: Number(form.budget_min), budget_max: Number(form.budget_max), currency_type: form.currency_type, deadline: form.deadline || null }, { onSuccess: onClose })
  }
  return (
    <Modal title="Post a Job" onClose={onClose}>
      <div style={{ marginBottom: "12px" }}><Lbl>title</Lbl><input value={form.title} onChange={set("title")} placeholder="e.g. Need a React developer for 2 weeks" style={fld(errors.title)} /><Err msg={errors.title} /></div>
      <div style={{ marginBottom: "12px" }}><Lbl>description</Lbl><textarea value={form.description} onChange={set("description")} placeholder="Describe the job, deliverables and requirements..." rows={4} style={{ ...fld(errors.description), resize: "vertical" }} /><Err msg={errors.description} /></div>
      <div style={{ marginBottom: "12px" }}><Lbl>category</Lbl><select value={form.category} onChange={set("category")} style={{ ...fld(), cursor: "pointer" }}>{CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
      <div style={{ marginBottom: "12px" }}><Lbl>skills required (comma separated)</Lbl><input value={form.skills_required} onChange={set("skills_required")} placeholder="e.g. React, Django, PostgreSQL" style={fld()} /></div>
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
        <div style={{ flex: 1 }}><Lbl>budget min (KES)</Lbl><input type="number" value={form.budget_min} onChange={set("budget_min")} placeholder="5000" style={fld(errors.budget_min)} /><Err msg={errors.budget_min} /></div>
        <div style={{ flex: 1 }}><Lbl>budget max (KES)</Lbl><input type="number" value={form.budget_max} onChange={set("budget_max")} placeholder="20000" style={fld(errors.budget_max)} /><Err msg={errors.budget_max} /></div>
      </div>
      <div style={{ marginBottom: "12px" }}><Lbl>currency</Lbl><select value={form.currency_type} onChange={set("currency_type")} style={{ ...fld(), cursor: "pointer" }}><option value="real">KES (Real)</option><option value="nenocoin">NenoCoin</option></select></div>
      <div style={{ marginBottom: "20px" }}><Lbl>deadline (optional)</Lbl><input type="date" value={form.deadline} onChange={set("deadline")} style={fld()} /></div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}>Cancel</button>
        <button onClick={submit} disabled={isPending} style={{ flex: 1, padding: "10px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)", color: "#0a0a0a", fontWeight: 700, fontSize: "13px", cursor: isPending ? "not-allowed" : "pointer", opacity: isPending ? 0.7 : 1 }}>{isPending ? "Posting..." : "Post Job"}</button>
      </div>
    </Modal>
  )
}

function ContractsTab() {
  const { data: contracts, isLoading } = useContracts()
  const list = contracts?.results || contracts || []
  if (isLoading) return <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading contracts...</p>
  if (!list.length) return (
    <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", opacity: 0.4 }}><BriefcaseIcon /></div>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>No contracts yet</div>
      <div style={{ fontSize: "13px" }}>Accept a bid or order a gig to start.</div>
    </div>
  )
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {list.map((c) => (
        <div key={c.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "18px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{c.title}</div>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", padding: "2px 10px", borderRadius: "var(--radius-sm)", background: c.status === "active" ? "rgba(74,222,128,0.1)" : "var(--bg-tertiary)", color: c.status === "active" ? "var(--success)" : "var(--text-muted)" }}>{c.status}</span>
          </div>
          <div style={{ display: "flex", gap: "20px", fontSize: "12px", color: "var(--text-secondary)", flexWrap: "wrap" }}>
            <span>Client: <b style={{ color: "var(--text-primary)" }}>{c.client?.username}</b></span>
            <span>Dev: <b style={{ color: "var(--text-primary)" }}>{c.developer?.username}</b></span>
            <span style={{ marginLeft: "auto", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>KES {Number(c.total_amount).toLocaleString()}</span>
          </div>
          {c.milestones && c.milestones.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {c.milestones.map((m) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "12px", color: "var(--text-primary)" }}>{m.title}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>KES {Number(m.amount).toLocaleString()}</span>
                    <span style={{ fontSize: "10px", padding: "2px 7px", borderRadius: "var(--radius-sm)", background: m.status === "approved" ? "rgba(74,222,128,0.1)" : m.status === "submitted" ? "rgba(250,204,21,0.1)" : "var(--bg-elevated)", color: m.status === "approved" ? "var(--success)" : m.status === "submitted" ? "var(--warning)" : "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function MarketplacePage() {
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const [tab, setTab] = useState("gigs")
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [budgetFilter, setBudgetFilter] = useState("")
  const [showCreateGig, setShowCreateGig] = useState(false)
  const [showPostJob, setShowPostJob] = useState(false)

  const { data: gigs, isLoading: gigsLoading } = useGigs({ q: search || undefined, category: categoryFilter || undefined })
  const { data: jobs, isLoading: jobsLoading } = useJobs({ q: search || undefined, category: categoryFilter || undefined, budget: budgetFilter || undefined })
  const gigList = gigs?.results || gigs || []
  const jobList = jobs?.results || jobs || []
  const handleSearch = (e) => { if (e.key === "Enter") setSearch(searchInput) }

  const tabStyle = (t) => ({ padding: "7px 18px", borderRadius: "var(--radius-sm)", border: "1px solid", borderColor: tab === t ? "var(--accent)" : "var(--border)", background: tab === t ? "var(--accent-dim)" : "transparent", color: tab === t ? "var(--accent)" : "var(--text-secondary)", fontSize: "13px", fontWeight: tab === t ? 600 : 400, cursor: "pointer" })
  const chip = (active) => ({ padding: "4px 12px", borderRadius: "var(--radius-sm)", border: "1px solid", borderColor: active ? "var(--accent)" : "var(--border)", background: active ? "var(--accent-dim)" : "transparent", color: active ? "var(--accent)" : "var(--text-secondary)", fontSize: "12px", cursor: "pointer" })

  return (
    <div>
      {showCreateGig && <CreateGigModal onClose={() => setShowCreateGig(false)} />}
      {showPostJob && <PostJobModal onClose={() => setShowPostJob(false)} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>Marketplace</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", marginTop: "4px" }}>Browse gigs or post a job</p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button onClick={() => setShowPostJob(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-secondary)", fontSize: "13px", cursor: "pointer" }}><PlusIcon /> Post Job</button>
          {user?.is_developer && (
            <button onClick={() => setShowCreateGig(true)} style={{ display: "flex", alignItems: "center", gap: "6px", padding: "9px 16px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)", color: "#0a0a0a", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}><PlusIcon /> Create Gig</button>
          )}
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        <button style={tabStyle("gigs")} onClick={() => setTab("gigs")}>Gigs</button>
        <button style={tabStyle("jobs")} onClick={() => setTab("jobs")}>Jobs</button>
        <button style={tabStyle("contracts")} onClick={() => setTab("contracts")}>Contracts</button>
      </div>

      {tab !== "contracts" && (
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
            <div style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }}><SearchIcon /></div>
            <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={handleSearch} placeholder="Search... (Enter)" style={{ width: "100%", boxSizing: "border-box", padding: "9px 12px 9px 34px", background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-primary)", fontSize: "13px", outline: "none" }} />
          </div>
          {searchInput && <button onClick={() => { setSearchInput(""); setSearch("") }} style={{ padding: "9px 12px", background: "transparent", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", color: "var(--text-muted)", fontSize: "12px", cursor: "pointer" }}>Clear</button>}
        </div>
      )}

      {tab === "jobs" && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
          {[["", "All"], ...CATEGORIES.map((c) => [c, c])].map(([val, label]) => (
            <button key={val} onClick={() => setCategoryFilter(val)} style={chip(categoryFilter === val)}>{label}</button>
          ))}
        </div>
      )}

      {tab === "jobs" && (
        <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
          {[["", "Any budget"], ["low", "Under 20k"], ["mid", "20k-100k"], ["high", "Over 100k"]].map(([val, label]) => (
            <button key={val} onClick={() => setBudgetFilter(val)} style={chip(budgetFilter === val)}>{label}</button>
          ))}
        </div>
      )}

      {tab === "gigs" && (
        gigsLoading ? <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading gigs...</p>
        : gigList.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
            {gigList.map((gig) => <GigCard key={gig.id} gig={gig} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", opacity: 0.4 }}><StoreIcon /></div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>No gigs yet</div>
            <div style={{ fontSize: "13px" }}>{user?.is_developer ? "Be the first to create a gig." : "Check back soon."}</div>
          </div>
        )
      )}

      {tab === "jobs" && (
        jobsLoading ? <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Loading jobs...</p>
        : jobList.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
            {jobList.map((job) => <JobCard key={job.id} job={job} onClick={() => navigate("/marketplace/jobs/" + job.id)} />)}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px", opacity: 0.4 }}><BriefcaseIcon /></div>
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "6px" }}>No jobs posted yet</div>
            <div style={{ fontSize: "13px" }}>Be the first to post a job.</div>
          </div>
        )
      )}

      {tab === "contracts" && <ContractsTab />}
    </div>
  )
}
