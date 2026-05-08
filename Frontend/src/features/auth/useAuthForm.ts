import { useState } from 'react'
import type { FormEvent } from 'react'
import { clearAuthSession, saveAuthSession } from '../../lib/tokenStorage'
import { authenticateUser } from './authApi'
import type { AuthMode, AuthUser } from './authTypes'

export function useAuthForm() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleAuthSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      const result = await authenticateUser(mode, email, password)

      if (!result.ok || !result.data.user) {
        setError(result.ok ? 'Authentication failed. Please try again.' : result.message)
        return
      }

      if (result.data.session) {
        saveAuthSession(result.data.session)
      }

      setCurrentUser(result.data.user)
      setSuccess(result.data.message ?? 'You are signed in.')
      setPassword('')
    } catch {
      setError('Cannot connect to API. Check backend server and CORS settings.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleLogout() {
    clearAuthSession()
    setCurrentUser(null)
    setSuccess('Logged out successfully.')
    setError('')
    setMode('login')
  }

  return {
    mode,
    setMode,
    email,
    setEmail,
    password,
    setPassword,
    currentUser,
    isLoading,
    error,
    success,
    handleAuthSubmit,
    handleLogout,
  }
}
