import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth-store'

const AppLayout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">JTracker</div>
        <nav className="nav">
          <NavLink to="/applications" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Applications
          </NavLink>
        </nav>
        <div className="header-actions">
          <span className="user-chip">{user?.name || user?.email}</span>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout

