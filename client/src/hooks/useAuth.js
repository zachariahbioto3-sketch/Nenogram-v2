import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { authAPI } from "../api/auth"
import { useAuthStore } from "../store/authStore"
import { useUIStore } from "../store/uiStore"

export function useMe() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: ["me"],
    queryFn: () => authAPI.me().then((r) => r.data),
    enabled: isAuthenticated,
  })
}

export function useLogin() {
  const { setTokens, setUser } = useAuthStore()
  const addNotification = useUIStore((s) => s.addNotification)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh)
      setUser(res.data.user)
      addNotification("Welcome back " + res.data.user.username, "success")
      navigate("/")
    },
    onError: (err) => {
      const msg = err.response?.data?.non_field_errors?.[0] || "Login failed"
      addNotification(msg, "error")
    },
  })
}

export function useRegister() {
  const { setTokens, setUser } = useAuthStore()
  const addNotification = useUIStore((s) => s.addNotification)
  const navigate = useNavigate()
  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (res) => {
      setTokens(res.data.access, res.data.refresh)
      setUser(res.data.user)
      addNotification("Account created successfully", "success")
      navigate("/")
    },
    onError: (err) => {
      const errors = err.response?.data
      const msg = errors ? Object.values(errors).flat()[0] : "Registration failed"
      addNotification(msg, "error")
    },
  })
}

export function useLogout() {
  const { logout, refreshToken } = useAuthStore()
  const addNotification = useUIStore((s) => s.addNotification)
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: () => authAPI.logout({ refresh: refreshToken }),
    onSettled: () => {
      logout()
      queryClient.clear()
      addNotification("Logged out", "info")
      navigate("/login")
    },
  })
}
