import { useState } from "react"
import { Link } from "react-router-dom"
import AuthLayout from "../../components/layout/AuthLayout"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import { useLogin } from "../../hooks/useAuth"

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" })
  const login = useLogin()
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = (e) => { e.preventDefault(); login.mutate(form) }
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        <Input label="Email" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} />
        <Input label="Password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
        <Button onClick={handleSubmit} loading={login.isPending} fullWidth>Sign in</Button>
        <p style={{ textAlign: "center", fontSize: "var(--text-sm)", color: "var(--text-secondary)" }}>
          No account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </AuthLayout>
  )
}
