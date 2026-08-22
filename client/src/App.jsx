import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Notifications from './components/ui/Notifications'
import AppLayout from './components/layout/AppLayout'

import LoginPage        from './pages/auth/LoginPage'
import RegisterPage     from './pages/auth/RegisterPage'
import DashboardPage    from './pages/dashboard/DashboardPage'
import MarketplacePage  from './pages/marketplace/MarketplacePage'
import JobDetailPage    from './pages/marketplace/JobDetailPage'
import WalletPage       from './pages/wallet/WalletPage'
import ProfilePage      from './pages/profile/ProfilePage'
import HubPage          from './pages/hub/HubPage'
import NanoPage         from './pages/nano/NanoPage'
import SettingsPage     from './pages/settings/SettingsPage'
import HackathonPage    from './pages/hackathon/HackathonPage'
import NotificationsPage from './pages/notifications/NotificationsPage'
import NegotiationRoomPage from './pages/negotiation/NegotiationRoomPage'
import ContractsPage from './pages/contracts/ContractsPage'
import NegotiationPage from './pages/negotiation/NegotiationRoomPage'
import LandingPage from './pages/landing/LandingPage'

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to='/login' replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Notifications />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/login'    element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route path='dashboard'               element={<DashboardPage />} />
          <Route path='marketplace'             element={<MarketplacePage />} />
          <Route path='marketplace/jobs/:id'    element={<JobDetailPage />} />
          <Route path='wallet'                  element={<WalletPage />} />
          <Route path='profile/:username'       element={<ProfilePage />} />
          <Route path='hub'                     element={<HubPage />} />
          <Route path='nano'                    element={<NanoPage />} />
          <Route path='settings'               element={<SettingsPage />} />
          <Route path='hackathon'              element={<HackathonPage />} />
          <Route path='notifications' element={<NotificationsPage />} />
          <Route path='negotiation/:roomId' element={<NegotiationRoomPage />} />
          <Route path='contracts'              element={<ContractsPage />} />
        </Route>
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  )
}
