import type { AuthSession } from '../features/auth/authTypes'

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export function saveAuthSession(session: AuthSession) {
  localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken)
}

export function clearAuthSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}
