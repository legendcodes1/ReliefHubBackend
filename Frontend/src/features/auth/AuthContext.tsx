/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { clearAuthSession, saveAuthSession } from '../../lib/tokenStorage'
import { refreshSession } from './authApi'
import type { AuthUser } from './authTypes'

type AuthContextValue = {
  isAuthLoading: boolean
  isAuthenticated: boolean
  currentUser: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function bootstrapAuth() {
      try {
        const { response, data } = await refreshSession()

        if (!isMounted) {
          return
        }

        if (response.ok && data.session?.accessToken && data.user) {
          saveAuthSession({ accessToken: data.session.accessToken })
          setCurrentUser(data.user)
          setIsAuthenticated(true)
          return
        }
      } catch {
        // leave user signed out
      }

      if (isMounted) {
        clearAuthSession()
        setCurrentUser(null)
        setIsAuthenticated(false)
      }
    }

    bootstrapAuth().finally(() => {
      if (isMounted) {
        setIsAuthLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthLoading,
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
    [currentUser, isAuthLoading, isAuthenticated],
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
