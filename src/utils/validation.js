export const STATUS_OPTIONS = ['APPLIED', 'INTERVIEWING', 'REJECTED', 'OFFER', 'ACCEPTED']

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,15}$/

export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!email || !emailRegex.test(email)) errors.email = 'Valid email is required'
  if (!password) errors.password = 'Password is required'
  return errors
}

export const validateRegister = ({ email, password, name }) => {
  const errors = validateLogin({ email, password })
  if (!name || !name.trim()) errors.name = 'Name is required'
  if (password && !passwordRegex.test(password)) {
    errors.password = '8-15 chars, 1 capital letter, 1 symbol'
  }
  return errors
}

export const validateApplication = ({ position, company, url, status }) => {
  const errors = {}
  if (!position || !position.trim()) errors.position = 'Position is required'
  if (!company || !company.trim()) errors.company = 'Company is required'
  try {
    new URL(url)
  } catch {
    errors.url = 'Valid URL is required'
  }
  if (!STATUS_OPTIONS.includes(status)) {
    errors.status = 'Status must be a valid option'
  }
  return errors
}

