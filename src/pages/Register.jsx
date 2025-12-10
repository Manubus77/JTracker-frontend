import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import { useAuth } from '../store/auth-store'
import { validateRegister } from '../utils/validation'

const Register = () => {
  const { register, user, loading, error, clearError, initializing } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState({ name: '', email: '', password: '' })
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
    const errors = validateRegister(values)
    setValidationErrors(errors)
    if (Object.keys(errors).length) return
    await register(values)
    navigate('/applications', { replace: true })
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
        <h2>Register</h2>
        <p className="muted">Create an account to track your applications.</p>
        {error && <Alert type="error" message={error.message} />}
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={values.name} onChange={handleChange} required />
            {validationErrors.name && <small>{validationErrors.name}</small>}
          </div>
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
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register

