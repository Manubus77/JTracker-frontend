import { useState } from 'react'
import { STATUS_OPTIONS, validateApplication } from '../../../utils/validation'

const blank = {
  position: '',
  company: '',
  url: '',
  status: 'APPLIED',
}

const ApplicationForm = ({ initialValues = blank, onSubmit, submitLabel = 'Save', disableUrl = false, loading }) => {
  const [values, setValues] = useState({ ...blank, ...initialValues })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateApplication(values)
    setErrors(validation)
    if (Object.keys(validation).length) return
    await onSubmit(values)
    if (!disableUrl) {
      setValues(blank)
    }
  }

  return (
    <form className="form-grid" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="position">Position</label>
        <input id="position" name="position" value={values.position} onChange={handleChange} required />
        {errors.position && <small>{errors.position}</small>}
      </div>
      <div className="field">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" value={values.company} onChange={handleChange} required />
        {errors.company && <small>{errors.company}</small>}
      </div>
      <div className="field">
        <label htmlFor="url">Job URL</label>
        <input
          id="url"
          name="url"
          value={values.url}
          onChange={handleChange}
          required
          disabled={disableUrl}
        />
        {errors.url && <small>{errors.url}</small>}
      </div>
      <div className="field">
        <label htmlFor="status">Status</label>
        <select id="status" name="status" value={values.status} onChange={handleChange}>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.status && <small>{errors.status}</small>}
      </div>
      <div className="flex">
        <button className="btn" type="submit" disabled={loading}>
          {submitLabel}
        </button>
        {loading && <span className="muted">Saving…</span>}
      </div>
    </form>
  )
}

export default ApplicationForm

