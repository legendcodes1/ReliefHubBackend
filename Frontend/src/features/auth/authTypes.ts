export type AuthMode = 'login' | 'signup'

export type AuthUser = {
  id: string
  email: string | null
}

export type AuthSession = {
  accessToken: string
}

export type AuthResponse = {
  message?: string
  user?: AuthUser
  session?: AuthSession | null
}

export type ApiResult<T> =
  | {
      ok: true
      data: T
      status: number
    }
  | {
      ok: false
      message: string
      status: number
    }
