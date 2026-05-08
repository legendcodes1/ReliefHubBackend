import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuthContext } from './AuthContext'
import { AuthForm } from './AuthForm'
import { AuthModeLinks } from './AuthModeLinks'
import { authModeConfig } from './authModeConfig'
import { useAuthForm } from './useAuthForm'

export function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuthContext()
  const { mode, setMode, email, setEmail, password, setPassword, currentUser, isLoading, error, success, handleAuthSubmit } = useAuthForm()

  useEffect(() => {
    setMode(location.pathname === '/signup' ? 'signup' : 'login')
  }, [location.pathname, setMode])

  useEffect(() => {
    if (!currentUser) {
      return
    }

    login(currentUser)
    navigate('/home', { replace: true })
  }, [currentUser, login, navigate])

  function handleModeChange(nextMode: 'login' | 'signup') {
    setMode(nextMode)
    navigate(nextMode === 'signup' ? '/signup' : '/login')
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-5xl gap-4 lg:grid-cols-[1.02fr_0.98fr]">
        <section className="rounded-3xl border border-[color:var(--line)] bg-[linear-gradient(180deg,_#f8fbf8_0%,_#ebf5f2_100%)] p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--brand)]">Pain Recovery Guide</p>
          <h1 className="mt-3 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Welcome to ReliefHub</h1>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-body)]">
            Build a steady recovery rhythm with exercise recommendations matched to your discomfort and body area.
          </p>

          <div className="mt-5 grid gap-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-white/80 p-3">
              <p className="text-sm font-semibold text-[color:var(--text-strong)]">Guided, not diagnostic</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">Get movement suggestions and safety notes, not medical diagnosis.</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/80 p-3">
              <p className="text-sm font-semibold text-[color:var(--text-strong)]">Personalized flow</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">Choose body part, choose discomfort, and review matched routines.</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-white/80 p-3">
              <p className="text-sm font-semibold text-[color:var(--text-strong)]">Save and revisit</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">Keep useful exercises in one place for consistent follow-through.</p>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--accent)]">Account Access</p>
          <h2 className="mt-2 text-3xl font-semibold text-[color:var(--text-strong)]">{authModeConfig[mode].heading}</h2>

          <AuthForm
            email={email}
            password={password}
            buttonLabel={authModeConfig[mode].buttonLabel}
            isLoading={isLoading}
            onEmailChange={setEmail}
            onPasswordChange={setPassword}
            onSubmit={handleAuthSubmit}
          />

          {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          {success && <p className="mt-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p>}

          <AuthModeLinks onModeChange={handleModeChange} />
        </section>
      </div>
    </main>
  )
}
