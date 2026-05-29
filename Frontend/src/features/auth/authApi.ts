import { requestJson } from '../../lib/apiClient'
import type { ApiResult, AuthMode, AuthResponse } from './authTypes'

type AuthCredentials = {
  username: string
  email: string
  password: string
}

export async function authenticateUser(mode: AuthMode, credentials: AuthCredentials): Promise<ApiResult<AuthResponse>> {
  const body = mode === 'signup'
    ? {
        username: credentials.username,
        email: credentials.email,
        password: credentials.password,
      }
    : {
        email: credentials.email,
        password: credentials.password,
      }

  const { response, data } = await requestJson<AuthResponse>(`/api/v1/auth/${mode}`, {
    method: 'POST',
    body,
  })

  if (!response.ok) {
    return {
      ok: false,
      message: data.message ?? 'Authentication failed. Please try again.',
      status: response.status,
    }
  }

  return {
    ok: true,
    data,
    status: response.status,
  }
}

export async function logoutUser() {
  return requestJson<{ message?: string }>('/api/v1/auth/logout', {
    method: 'POST',
    withAuth: true,
  })
}

export async function refreshSession() {
  return requestJson<AuthResponse>('/api/v1/auth/refresh', {
    method: 'POST',
  })
}
