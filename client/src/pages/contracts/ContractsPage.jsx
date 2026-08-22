import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { fetchMyRooms } from "../../api/negotiation"
import api from "../../api/axios"

export default function ContractsPage() {
  const [contracts, setContracts] = useState([])
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get("/marketplace/contracts/"),
      fetchMyRooms(),
    ]).then(([contractsRes, roomsRes]) => {
      setContracts(contractsRes.data.results || contractsRes.data)
      setRooms(roomsRes.data)
      setLoading(false)
    })
  }, [])

  const getRoomForContract = (contractId) =>
    rooms.find((r) => r.contract === contractId)

  if (loading) return (
    <div style={{ color: "var(--text-muted)", fontSize: "14px", padding: "40px" }}>Loading contracts...</div>
  )

  if (contracts.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>No contracts yet</div>
      <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>Accepted bids will appear here.</div>
    </div>
  )

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.3px" }}>Contracts</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>Your active and completed contracts.</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {contracts.map((c) => {
          const room = getRoomForContract(c.id)
          const statusColor = c.status === "active" ? "var(--success)" : c.status === "completed" ? "var(--accent)" : "var(--danger)"
          const statusBg = c.status === "active" ? "rgba(74,222,128,0.1)" : c.status === "completed" ? "var(--accent-dim)" : "rgba(248,113,113,0.1)"
          return (
            <div key={c.id} style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{c.title}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: "3px" }}>
                    {c.source === "job" ? "Job Contract" : "Gig Order"} · created {new Date(c.created_at).toLocaleDateString()}
                  </div>
                </div>
                <span style={{ fontSize: "11px", padding: "3px 10px", borderRadius: "var(--radius-sm)", fontFamily: "var(--font-mono)", background: statusBg, color: statusColor }}>
                  {c.status}
                </span>
              </div>

              <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>client</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{c.client?.username}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>developer</div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{c.developer?.username}</div>
                </div>
                <div>
                  <div style={{ fontSize: "10px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>total</div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>KES {Number(c.total_amount).toLocaleString()}</div>
                </div>
              </div>

              {c.milestones?.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>milestones</div>
                  {c.milestones.map((m) => (
                    <div key={m.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
                      <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>{m.title}</span>
                      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>KES {Number(m.amount).toLocaleString()}</span>
                        <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 8px", borderRadius: "var(--radius-full)", background: m.status === "approved" ? "rgba(74,222,128,0.1)" : "var(--bg-secondary)", color: m.status === "approved" ? "var(--success)" : "var(--text-muted)", border: "1px solid var(--border)" }}>{m.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {room && (
                <button
                  onClick={() => navigate(`/negotiation/${room.id}`)}
                  style={{ alignSelf: "flex-start", padding: "8px 18px", background: "var(--accent)", border: "none", borderRadius: "var(--radius-md)", color: "#0a0a0a", fontWeight: 700, fontSize: "13px", cursor: "pointer" }}
                >
                  {room.status === "locked" ? "View Contract Room" : "Open Negotiation Room ?"}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
