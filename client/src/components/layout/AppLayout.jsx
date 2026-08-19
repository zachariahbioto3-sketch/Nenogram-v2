import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar />
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        marginLeft: '96px',
        minWidth: 0,
      }}>
        <Topbar />
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: '28px 32px',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
