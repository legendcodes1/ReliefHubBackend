import type { AuthSession } from '../features/auth/authTypes'

let accessToken: string | null = null

export function saveAuthSession(session: AuthSession) {
  accessToken = session.accessToken
}

export function clearAuthSession() {
  accessToken = null
}

export function getAccessToken() {
  return accessToken
}
