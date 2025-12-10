import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import { useAuth } from '../store/auth-store'
import { validateLogin } from '../utils/validation'

const Login = () => {
  const { login, user, loading, error, clearError, initializing } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState({ email: '', password: '' })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    if (!initializing && user) {
      navigate('/applications', { replace: true })
    }
  }, [initializing, user, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errors = validateLogin(values)
    setValidationErrors(errors)
    if (Object.keys(errors).length) return
    await login(values)
    const redirectTo = location.state?.from?.pathname || '/applications'
    navigate(redirectTo, { replace: true })
  }

  if (initializing) {
    return (
      <div className="centered">
        <Loader />
      </div>
    )
  }

  return (
    <div className="centered">
      <div className="card" style={{ minWidth: '360px' }}>
        <h2>Login</h2>
        <p className="muted">Access your JTracker account.</p>
        {error && <Alert type="error" message={error.message} />}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" value={values.email} onChange={handleChange} required />
            {validationErrors.email && <small>{validationErrors.email}</small>}
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={values.password}
              onChange={handleChange}
              required
            />
            {validationErrors.password && <small>{validationErrors.password}</small>}
          </div>
          <button className="btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="muted">
          Need an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}

export default Login

