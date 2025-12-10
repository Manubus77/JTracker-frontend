import { useState } from 'react'
import Alert from '../components/Alert'
import Loader from '../components/Loader'
import ApplicationFilters from '../features/applications/components/ApplicationFilters'
import ApplicationForm from '../features/applications/components/ApplicationForm'
import ApplicationTable from '../features/applications/components/ApplicationTable'
import { DEFAULT_FILTERS, useApplications } from '../features/applications/hooks/useApplications'

const Applications = () => {
  const { items, loading, error, filters, meta, fetchApplications, createApplication, updateApplication, removeApplication } =
    useApplications()
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [actionError, setActionError] = useState(null)

  const handleCreate = async (values) => {
    setSaving(true)
    setActionError(null)
    try {
      await createApplication(values)
    } catch (err) {
      setActionError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (values) => {
    if (!editing) return
    setSaving(true)
    setActionError(null)
    try {
      await updateApplication(editing.id, { position: values.position, company: values.company, status: values.status })
      setEditing(null)
    } catch (err) {
      setActionError(err)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Delete this application?')
    if (!confirmed) return
    setActionError(null)
    try {
      await removeApplication(id)
    } catch (err) {
      setActionError(err)
    }
  }

  const handleFilterChange = (partial) => {
    fetchApplications({ ...filters, ...partial })
  }

  const resetFilters = () => {
    fetchApplications(DEFAULT_FILTERS)
  }

  const isEditing = Boolean(editing)

  return (
    <div className="page">
      <div className="card">
        <div className="flex-between">
          <h2>{isEditing ? 'Edit Application' : 'Add Application'}</h2>
          {loading && <Loader />}
        </div>
        {actionError && <Alert type="error" message={actionError.message} />}
        {isEditing ? (
          <ApplicationForm
            initialValues={editing}
            onSubmit={handleUpdate}
            submitLabel="Update"
            disableUrl
            loading={saving}
          />
        ) : (
          <ApplicationForm onSubmit={handleCreate} submitLabel="Create" loading={saving} />
        )}
      </div>

      <div className="card">
        <div className="flex-between">
          <h3>Filters</h3>
          <span className="muted">
            Page {meta.page} / {meta.totalPages || 1} • Total {meta.total || 0}
          </span>
        </div>
        <ApplicationFilters filters={filters} onChange={handleFilterChange} onReset={resetFilters} />
      </div>

      {error && <Alert type="error" message={error.message} />}

      {loading && !items.length ? (
        <div className="card">
          <Loader message="Loading applications..." />
        </div>
      ) : (
        <ApplicationTable items={items} onEdit={setEditing} onDelete={handleDelete} />
      )}

      <div className="flex" style={{ marginTop: '1rem' }}>
        <button className="btn btn-ghost" disabled={filters.page <= 1} onClick={() => fetchApplications({ page: filters.page - 1 })}>
          Previous
        </button>
        <button
          className="btn btn-ghost"
          disabled={filters.page >= (meta.totalPages || 1)}
          onClick={() => fetchApplications({ page: filters.page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Applications

