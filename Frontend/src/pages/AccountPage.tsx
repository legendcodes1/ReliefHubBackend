import { useAuthContext } from '../features/auth/AuthContext'

export function AccountPage() {
  const { currentUser } = useAuthContext()

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Account Settings</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Your Profile</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Review your login identity and upcoming recovery preferences.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Profile</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">Email</dt>
              <dd className="mt-1 text-sm font-medium text-[color:var(--text-strong)]">{currentUser?.email ?? 'Unavailable'}</dd>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">User ID</dt>
              <dd className="mt-1 break-all text-sm font-medium text-[color:var(--text-strong)]">{currentUser?.id ?? 'Unavailable'}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Recovery Preferences</h2>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">Personalized controls are rolling out in upcoming updates.</p>
          <div className="mt-4 grid gap-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3 text-sm text-[color:var(--text-body)]">Gentle progression reminders enabled soon.</div>
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3 text-sm text-[color:var(--text-body)]">Weekly consistency summaries coming soon.</div>
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3 text-sm text-[color:var(--text-body)]">Safety profile customization coming soon.</div>
          </div>
          <div className="mt-4 rounded-xl border border-amber-200 bg-[color:var(--warning-soft)] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--warning-text)]">Coming Soon</p>
            <p className="mt-1 text-sm text-[color:var(--warning-text)]">Preference controls will be available here without changing your current account flow.</p>
          </div>
        </article>
      </section>
    </main>
  )
}
