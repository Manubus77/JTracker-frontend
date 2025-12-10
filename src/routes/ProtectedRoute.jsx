import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../store/auth-store'
import Loader from '../components/Loader'

const ProtectedRoute = ({ children }) => {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return (
      <div className="centered">
        <Loader message="Checking session..." />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute

