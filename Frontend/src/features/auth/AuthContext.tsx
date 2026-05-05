/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { clearAuthSession, getAccessToken } from '../../lib/tokenStorage'
import type { AuthUser } from './authTypes'

type AuthContextValue = {
  isAuthenticated: boolean
  currentUser: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(getAccessToken()))

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      currentUser,
      login: (user) => {
        setCurrentUser(user)
        setIsAuthenticated(true)
      },
      logout: () => {
        clearAuthSession()
        setCurrentUser(null)
        setIsAuthenticated(false)
      },
    }),
    [currentUser, isAuthenticated],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
