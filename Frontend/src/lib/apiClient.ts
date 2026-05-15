import { clearAuthSession, getAccessToken, saveAuthSession } from './tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000'
type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  withAuth?: boolean
  query?: Record<string, string | number | boolean | null | undefined>
}

type ApiClientResult<T> = {
  response: Response
  data: T
}

type AuthRefreshResponse = {
  session?: {
    accessToken: string
  } | null
}

async function refreshAccessToken() {
  const response = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const data = (await response.json().catch(() => ({}))) as AuthRefreshResponse

  if (!response.ok || !data.session?.accessToken) {
    clearAuthSession()
    return false
  }

  saveAuthSession({ accessToken: data.session.accessToken })
  return true
}

export async function requestJson<T>(path: string, options: RequestOptions = {}, hasRetried = false): Promise<ApiClientResult<T>> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (options.withAuth) {
    const token = getAccessToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  const searchParams = new URLSearchParams()
  if (options.query) {
    for (const [key, value] of Object.entries(options.query)) {
      if (value !== undefined && value !== null) {
        searchParams.set(key, String(value))
      }
    }
  }

  const url = `${API_BASE_URL}${path}${searchParams.size > 0 ? `?${searchParams.toString()}` : ''}`

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  })

  if (options.withAuth && response.status === 401 && !hasRetried && path !== '/api/v1/auth/refresh') {
    const refreshed = await refreshAccessToken()
    if (refreshed) {
      return requestJson<T>(path, options, true)
    }
  }

  const data = (await response.json().catch(() => ({}))) as T

  return { response, data }
}
