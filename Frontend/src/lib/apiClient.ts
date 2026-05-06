import { getAccessToken } from './tokenStorage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://192.168.1.71:4000'

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

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<ApiClientResult<T>> {
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
  })

  const data = (await response.json().catch(() => ({}))) as T

  return { response, data }
}
