import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../features/auth/AuthContext'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthLoading, isAuthenticated } = useAuthContext()

  if (isAuthLoading) {
    return <p className="p-4 text-sm text-[color:var(--text-soft)]">Checking session...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { isAuthLoading, isAuthenticated } = useAuthContext()

  if (isAuthLoading) {
    return <p className="p-4 text-sm text-[color:var(--text-soft)]">Checking session...</p>
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return <>{children}</>
}
