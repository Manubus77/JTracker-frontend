import { STATUS_OPTIONS } from '../../../utils/validation'

const ApplicationFilters = ({ filters, onChange, onReset }) => {
  const handleChange = (e) => {
    const { name, value } = e.target
    onChange({ [name]: value, page: 1 })
  }

  return (
    <div className="filters">
      <div className="field">
        <label>Status</label>
        <select name="status" value={filters.status} onChange={handleChange}>
          <option value="">All</option>
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>Sort By</label>
        <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
          <option value="date">Date</option>
          <option value="status">Status</option>
        </select>
      </div>
      <div className="field">
        <label>Order</label>
        <select name="sortOrder" value={filters.sortOrder} onChange={handleChange}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
      <div className="field">
        <label>Page Size</label>
        <select name="pageSize" value={filters.pageSize} onChange={handleChange}>
          {[10, 20, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label>&nbsp;</label>
        <button className="btn btn-ghost" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  )
}

export default ApplicationFilters

