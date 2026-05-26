/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

const readStoredUser = () => {
  const storedUser = localStorage.getItem('user')
  return storedUser ? JSON.parse(storedUser) : null
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user, setUser] = useState(readStoredUser)

  const persistSession = useCallback((payload) => {
    localStorage.setItem('token', payload.token)
    localStorage.setItem('user', JSON.stringify(payload.user))
    setToken(payload.token)
    setUser(payload.user)
  }, [])

  const login = useCallback(async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    persistSession(data)
    return data
  }, [persistSession])

  const signup = useCallback(async (details) => {
    const { data } = await api.post('/auth/signup', details)
    persistSession(data)
    return data
  }, [persistSession])

  const updateProfile = useCallback(async (details) => {
    const { data } = await api.put('/auth/profile', details)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      signup,
      token,
      updateProfile,
      user,
    }),
    [login, logout, signup, token, updateProfile, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
