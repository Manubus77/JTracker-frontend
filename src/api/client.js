import { endpoints, applicationById } from './endpoints'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required')
}

let accessToken = null
let refreshPromise = null
let refreshSuccessHandler = null
let unauthorizedHandler = null

const withBase = (path) => (path.startsWith('http') ? path : `${API_BASE_URL}${path}`)

const parseJson = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

const buildError = async (response) => {
  const error = new Error(response.statusText || 'Request failed')
  error.status = response.status
  try {
    const data = await response.clone().json()
    error.message = data?.message || data?.error || error.message
    error.details = data
  } catch {
    // ignore parse errors
  }
  return error
}

export const setAccessToken = (token) => {
  accessToken = token || null
}

export const setAuthHandlers = ({ onRefreshSuccess, onUnauthorized } = {}) => {
  refreshSuccessHandler = onRefreshSuccess || null
  unauthorizedHandler = onUnauthorized || null
}

const attemptRefresh = async () => {
  if (refreshPromise) return refreshPromise
  refreshPromise = (async () => {
    try {
      const response = await fetch(withBase(endpoints.auth.refresh), {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) return null
      const data = await response.json()
      accessToken = data?.token || null
      refreshSuccessHandler?.(data)
      return data
    } catch {
      return null
    } finally {
      refreshPromise = null
    }
  })()
  return refreshPromise
}

export const apiFetch = async (
  path,
  options = {},
  { skipAuth = false, retryOn401 = true } = {}
) => {
  const headers = new Headers(options.headers || {})
  const init = {
    method: options.method || 'GET',
    credentials: options.credentials ?? 'include',
    ...options,
    headers,
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
    init.body = typeof options.body === 'string' ? options.body : JSON.stringify(options.body)
  }

  if (!skipAuth && accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`)
  }

  const response = await fetch(withBase(path), init)

  if (response.status === 401 && retryOn401) {
    const refreshed = await attemptRefresh()
    if (refreshed?.token) {
      return apiFetch(path, options, { skipAuth, retryOn401: false })
    }
    unauthorizedHandler?.()
    throw await buildError(response)
  }

  if (!response.ok) {
    throw await buildError(response)
  }

  return parseJson(response)
}

export const http = {
  get: (path, config) => apiFetch(path, { method: 'GET', ...config }),
  post: (path, body, config) => apiFetch(path, { method: 'POST', body, ...config }),
  patch: (path, body, config) => apiFetch(path, { method: 'PATCH', body, ...config }),
  put: (path, body, config) => apiFetch(path, { method: 'PUT', body, ...config }),
  delete: (path, config) => apiFetch(path, { method: 'DELETE', ...config }),
  applicationById,
}

