import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Notifications from './components/ui/Notifications'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import MarketplacePage from './pages/marketplace/MarketplacePage'
import WalletPage from './pages/wallet/WalletPage'
import ProfilePage from './pages/profile/ProfilePage'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to='/login' replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Notifications />
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/' element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path='/marketplace' element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
        <Route path='/wallet' element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
        <Route path='/profile/:username' element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
