const ApplicationTable = ({ items, onEdit, onDelete }) => {
  if (!items.length) {
    return <p className="muted">No applications yet.</p>
  }

  return (
    <div className="card">
      <div className="flex-between">
        <h3>Applications</h3>
        <span className="muted">{items.length} shown</span>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Position</th>
            <th>Company</th>
            <th>Status</th>
            <th>URL</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {items.map((app) => (
            <tr key={app.id}>
              <td>{app.position}</td>
              <td>{app.company}</td>
              <td>
                <span className="status-badge">{app.status}</span>
              </td>
              <td>
                <a href={app.url} target="_blank" rel="noreferrer">
                  Link
                </a>
              </td>
              <td>
                <div className="flex">
                  <button className="btn btn-ghost" onClick={() => onEdit(app)}>
                    Edit
                  </button>
                  <button className="btn btn-secondary" onClick={() => onDelete(app.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ApplicationTable

