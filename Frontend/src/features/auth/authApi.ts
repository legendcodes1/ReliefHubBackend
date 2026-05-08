import { requestJson } from '../../lib/apiClient'
import type { ApiResult, AuthMode, AuthResponse } from './authTypes'

export async function authenticateUser(mode: AuthMode, email: string, password: string): Promise<ApiResult<AuthResponse>> {
  const { response, data } = await requestJson<AuthResponse>(`/api/v1/auth/${mode}`, {
    method: 'POST',
    body: { email, password },
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
