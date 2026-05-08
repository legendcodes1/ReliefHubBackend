import type { AuthMode } from './authTypes'

type AuthModeLinksProps = {
  onModeChange: (mode: AuthMode) => void
}

export function AuthModeLinks({ onModeChange }: AuthModeLinksProps) {
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
      <button
        type="button"
        onClick={() => onModeChange('login')}
        className="rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1 text-[color:var(--text-body)] transition hover:bg-white"
      >
        Login
      </button>
      <span className="text-[color:var(--text-soft)]">or</span>
      <button
        type="button"
        onClick={() => onModeChange('signup')}
        className="rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1 text-[color:var(--text-body)] transition hover:bg-white"
      >
        Sign up
      </button>
    </div>
  )
}
