/**
 * Health check utility to verify backend connectivity on app load
 * Optional: Can be called from main.jsx or AppRouter to surface connectivity issues early
 */

import { endpoints } from '../api/endpoints'

/**
 * Check backend health endpoint
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export const checkBackendHealth = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    if (!API_BASE_URL) {
      return { ok: false, error: 'VITE_API_BASE_URL not configured' }
    }

    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return { ok: false, error: `Health check failed: ${response.status}` }
    }

    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message || 'Network error' }
  }
}

/**
 * Check backend database health endpoint
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export const checkBackendDbHealth = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
    if (!API_BASE_URL) {
      return { ok: false, error: 'VITE_API_BASE_URL not configured' }
    }

    const response = await fetch(`${API_BASE_URL}/health/db`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      return { ok: false, error: `DB health check failed: ${response.status}` }
    }

    return { ok: true }
  } catch (error) {
    return { ok: false, error: error.message || 'Network error' }
  }
}

