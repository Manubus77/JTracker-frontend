import { useEffect, useState } from 'react'
import { applicationById, endpoints } from '../../../api/endpoints'
import { http } from '../../../api/client'

export const DEFAULT_FILTERS = {
  status: '',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  pageSize: 10,
}

const buildQuery = (filters) => {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.sortBy) params.set('sortBy', filters.sortBy)
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder)
  params.set('page', String(filters.page))
  const pageSize = Math.min(Number(filters.pageSize) || 10, 100)
  params.set('pageSize', String(pageSize))
  return params.toString()
}

export const useApplications = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [meta, setMeta] = useState({ page: 1, pageSize: 10, total: 0, totalPages: 0 })

  const fetchApplications = async (override) => {
    const merged = { ...filters, ...override }
    merged.pageSize = Math.min(Number(merged.pageSize) || 10, 100)
    setLoading(true)
    setError(null)
    try {
      const query = buildQuery(merged)
      const data = await http.get(`${endpoints.applications}?${query}`)
      setItems(data.items || [])
      setMeta({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      })
      setFilters(merged)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  const createApplication = async (payload) => {
    const created = await http.post(endpoints.applications, payload)
    await fetchApplications()
    return created
  }

  const updateApplication = async (id, payload) => {
    const updated = await http.patch(applicationById(id), payload)
    setItems((prev) => prev.map((item) => (item.id === id ? updated : item)))
    return updated
  }

  const removeApplication = async (id) => {
    await http.delete(applicationById(id))
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  useEffect(() => {
    fetchApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    items,
    loading,
    error,
    filters,
    meta,
    fetchApplications,
    setFilters,
    createApplication,
    updateApplication,
    removeApplication,
  }
}

