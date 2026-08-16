import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/layout/AuthLayout"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { useRegister } from "../../hooks/useAuth"

const CURRENCIES = ["KES", "USD", "EUR", "GBP", "NGN", "ZAR"]

export default function RegisterPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "", password2: "", preferred_currency: "KES" })
  const register = useRegister()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); register.mutate(form) }
  return (
    <AuthLayout title="Create your account" subtitle="Join the Nenogram platform">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
        <Input label="Username" name="username" type="text" placeholder="yourhandle" value={form.username} onChange={handleChange} />
        <Input label="Password" name="password" type="password" placeholder="Min 8 characters" value={form.password} onChange={handleChange} />
        <Input label="Confirm Password" name="password2" type="password" placeholder="Repeat password" value={form.password2} onChange={handleChange} />
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
          <label style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontWeight: 500 }}>Preferred Currency</label>
          <select name="preferred_currency" value={form.preferred_currency} onChange={handleChange} style={{ background: "var(--bg-tertiary)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "var(--space-3) var(--space-4)", color: "var(--text-primary)", fontSize: "var(--text-base)", outline: "none", width: "100%" }}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <Button onClick={handleSubmit} loading={register.isPending} fullWidth>Create Account</Button>
        <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
