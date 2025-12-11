import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { endpoints } from '../api/endpoints'
import { http, setAccessToken, setAuthHandlers } from '../api/client'

const AuthContext = createContext(null)

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  initializing: true,
}

const authReducer = (state, action) => {
  switch (action.type) {
    case 'set-auth':
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        error: null,
      }
    case 'set-loading':
      return { ...state, loading: true, error: null }
    case 'set-error':
      return { ...state, loading: false, error: action.payload }
    case 'clear':
      return { ...initialState, initializing: false }
    case 'initialized':
      return { ...state, initializing: false, loading: false }
    default:
      return state
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  const applyAuth = (user, token) => {
    setAccessToken(token)
    dispatch({ type: 'set-auth', payload: { user, accessToken: token } })
  }

  const clearSession = () => {
    setAccessToken(null)
    dispatch({ type: 'clear' })
  }

  const refreshSession = async () => {
    try {
      const data = await http.post(
        endpoints.auth.refresh,
        {},
        { skipAuth: true, retryOn401: false }
      )
      if (data?.token) {
        applyAuth(data.user, data.token)
        return data
      }
    } catch (error) {
      clearSession()
      throw error
    }
    return null
  }

  const loadMe = async () => {
    try {
      const user = await http.get(endpoints.auth.me)
      if (user) {
        dispatch({ type: 'set-auth', payload: { user, accessToken: state.accessToken } })
      }
      return user
    } catch (error) {
      clearSession()
      throw error
    }
  }

  const login = async (credentials) => {
    dispatch({ type: 'set-loading' })
    try {
      const data = await http.post(endpoints.auth.login, credentials, { skipAuth: true })
      applyAuth(data.user, data.token)
      return data.user
    } catch (error) {
      dispatch({ type: 'set-error', payload: error })
      throw error
    }
  }

  const register = async (payload) => {
    dispatch({ type: 'set-loading' })
    try {
      const data = await http.post(endpoints.auth.register, payload, { skipAuth: true })
      applyAuth(data.user, data.token)
      return data.user
    } catch (error) {
      dispatch({ type: 'set-error', payload: error })
      throw error
    }
  }

  const logout = async ({ silent } = {}) => {
    try {
      if (!silent && state.accessToken) {
        await http.post(endpoints.auth.logout, {})
      }
    } catch {
      // ignore logout errors
    } finally {
      clearSession()
    }
  }

  useEffect(() => {
    setAuthHandlers({
      onRefreshSuccess: (data) => applyAuth(data?.user || null, data?.token || null),
      onUnauthorized: () => logout({ silent: true }),
    })

    const bootstrap = async () => {
      try {
        await refreshSession()
      } finally {
        dispatch({ type: 'initialized' })
      }
    }

    bootstrap()
  }, [])

  const value = useMemo(
    () => ({
      user: state.user,
      accessToken: state.accessToken,
      loading: state.loading,
      error: state.error,
      initializing: state.initializing,
      login,
      register,
      logout,
      refresh: refreshSession,
      loadMe,
      clearError: () => dispatch({ type: 'set-error', payload: null }),
    }),
    [state]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
