import type { FormEvent } from 'react'

type AuthFormProps = {
  username: string
  email: string
  password: string
  buttonLabel: string
  isLoading: boolean
  mode: 'login' | 'signup'
  onUsernameChange: (username: string) => void
  onEmailChange: (email: string) => void
  onPasswordChange: (password: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function LoginAuthForm({ email, password, buttonLabel, isLoading, onEmailChange, onPasswordChange, onSubmit }: AuthFormProps) {
  const submitLabel = isLoading ? 'Please wait...' : buttonLabel

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Password</span>
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
          placeholder="At least 8 characters"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  )
}

export function SignupAuthForm({ username, email, password, buttonLabel, isLoading, onUsernameChange, onEmailChange, onPasswordChange, onSubmit }: AuthFormProps) {
  const submitLabel = isLoading ? 'Please wait...' : buttonLabel

  return (
    <form className="mt-6 space-y-4" onSubmit={onSubmit}>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Username</span>
        <input
          required
          type="text"
          minLength={3}
          maxLength={30}
          pattern="[A-Za-z0-9_]{3,30}"
          value={username}
          onChange={(event) => onUsernameChange(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
          placeholder="letters, numbers, underscore"
        />
      </label>
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Email</span>
        <input
          required
          type="email"
          value={email}
          onChange={(event) => onEmailChange(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-[color:var(--text-body)]">Password</span>
        <input
          required
          minLength={8}
          type="password"
          value={password}
          onChange={(event) => onPasswordChange(event.target.value)}
          className="w-full rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-2.5 text-[color:var(--text-strong)] outline-none transition focus:border-[color:var(--brand)]"
          placeholder="At least 8 characters"
        />
      </label>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full rounded-xl bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitLabel}
      </button>
    </form>
  )
}

export function AuthForm(props: AuthFormProps) {
  if (props.mode === 'signup') {
    return <SignupAuthForm {...props} />
  }

  return <LoginAuthForm {...props} />
}
