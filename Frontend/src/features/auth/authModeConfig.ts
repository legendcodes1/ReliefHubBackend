import type { AuthMode } from './authTypes'

export const authModeConfig: Record<AuthMode, { heading: string; buttonLabel: string }> = {
  login: {
    heading: 'Welcome back',
    buttonLabel: 'Login',
  },
  signup: {
    heading: 'Create your account',
    buttonLabel: 'Sign up',
  },
}
