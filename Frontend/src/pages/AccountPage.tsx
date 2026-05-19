import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../features/auth/AuthContext'
import { logoutUser } from '../features/auth/authApi'
import { getRoutines } from '../features/routine/routineApi'
import { getFavoriteRoutines } from '../features/routine/routineFavoritesApi'
import type { FavoriteRoutine } from '../features/routine/routineFavoritesApi'
import type { PublicRoutine } from '../features/routine/routineTypes'
import { RoutineViewModal } from '../features/routine/RoutineViewModal'
import { getSavedExercises } from '../features/saved-exercises/savedExercisesApi'

export function AccountPage() {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuthContext()
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [savedCount, setSavedCount] = useState(0)
  const [routineCount, setRoutineCount] = useState(0)
  const [favoriteCount, setFavoriteCount] = useState(0)
  const [favoriteRoutines, setFavoriteRoutines] = useState<FavoriteRoutine[]>([])
  const [viewingRoutine, setViewingRoutine] = useState<PublicRoutine | null>(null)

  const initials = useMemo(() => {
    const email = currentUser?.email ?? ''
    if (!email) {
      return 'RH'
    }

    const [name] = email.split('@')
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2).toUpperCase()
    }

    return (cleaned || 'RH').toUpperCase()
  }, [currentUser?.email])

  useEffect(() => {
    let isMounted = true

    async function loadSnapshot() {
      setIsLoadingStats(true)

      try {
        const [savedResult, routinesResult, favoritesResult] = await Promise.all([
          getSavedExercises(),
          getRoutines(),
          getFavoriteRoutines(),
        ])

        if (!isMounted) {
          return
        }

        if (savedResult.response.ok) {
          setSavedCount(savedResult.data.length)
        }

        if (routinesResult.response.ok) {
          setRoutineCount(routinesResult.data.length)
        }

        if (favoritesResult.response.ok) {
          setFavoriteCount(favoritesResult.data.length)
          setFavoriteRoutines(favoritesResult.data)
        }
      } finally {
        if (isMounted) {
          setIsLoadingStats(false)
        }
      }
    }

    loadSnapshot()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleLogout() {
    try {
      await logoutUser()
    } catch {
      // local logout still runs even if API logout fails
    } finally {
      logout()
      navigate('/login')
    }
  }

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Account Settings</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Your Profile</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Review your login identity, activity snapshot, and quick account actions.</p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--brand-soft)] text-lg font-semibold text-[color:var(--brand-strong)]">
              {initials}
            </span>
            <div>
              <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Profile</h2>
              <p className="text-sm text-[color:var(--text-soft)]">ReliefHub Member</p>
            </div>
          </div>

          <dl className="mt-4 grid gap-3 text-sm">
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-3">
              <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">Email</dt>
              <dd className="mt-1 text-sm font-medium text-[color:var(--text-strong)]">{currentUser?.email ?? 'Unavailable'}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 inline-flex rounded-xl bg-[color:var(--text-strong)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            Logout
          </button>
        </article>

        <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm">
          <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Recovery Snapshot</h2>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">A quick look at your progress across saved exercises and routines.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">Saved</p>
              <p className="mt-1 text-xl font-semibold text-[color:var(--text-strong)]">{isLoadingStats ? '...' : savedCount}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">Routines</p>
              <p className="mt-1 text-xl font-semibold text-[color:var(--text-strong)]">{isLoadingStats ? '...' : routineCount}</p>
            </div>
            <div className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--text-soft)]">Favorites</p>
              <p className="mt-1 text-xl font-semibold text-[color:var(--text-strong)]">{isLoadingStats ? '...' : favoriteCount}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link to="/saved" className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]">
              View Saved
            </Link>
            <Link to="/my-routines" className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]">
              My Routines
            </Link>
            <Link to="/routines" className="rounded-xl bg-[color:var(--brand)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]">
              Build Routine
            </Link>
          </div>

          <div className="mt-4 rounded-xl border border-amber-200 bg-[color:var(--warning-soft)] p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--warning-text)]">Coming Soon</p>
            <p className="mt-1 text-sm text-[color:var(--warning-text)]">Preference controls (reminders, weekly summaries, safety profile) will be available here.</p>
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">Favorite Routines</h2>
            <p className="mt-1 text-sm text-[color:var(--text-soft)]">Routines you saved from the community.</p>
          </div>
          <Link to="/community-routines" className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]">
            Explore Community
          </Link>
        </div>

        {!isLoadingStats && favoriteRoutines.length === 0 && (
          <div className="mt-4 rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4">
            <p className="text-sm font-medium text-[color:var(--text-strong)]">No favorite routines yet.</p>
            <p className="mt-1 text-sm text-[color:var(--text-soft)]">Browse community routines and favorite the ones you want to keep.</p>
          </div>
        )}

        {favoriteRoutines.length > 0 && (
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {favoriteRoutines.map((favorite) => {
              const routine = favorite.routines
              const creator = routine.users.username || routine.users.email.split('@')[0] || 'ReliefHub member'

              return (
                <article
                  key={favorite.id}
                  onClick={() => setViewingRoutine(routine)}
                  className="flex h-full cursor-pointer flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800">
                      Favorited
                    </span>
                    <span className="text-[11px] text-[color:var(--text-soft)]">
                      {routine.routine_exercises.length} exercises
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">{routine.name}</h3>
                  <p className="mt-1 text-sm text-[color:var(--text-soft)]">By {creator}</p>

                  <div className="mt-4 border-t border-[color:var(--line)] pt-3">
                    <p className="text-xs font-medium text-[color:var(--text-soft)]">Exercises:</p>
                    <ul className="mt-2 space-y-1">
                      {routine.routine_exercises.slice(0, 3).map((routineExercise) => (
                        <li key={routineExercise.id} className="text-sm text-[color:var(--text-body)]">
                          • {routineExercise.exercises.title}
                        </li>
                      ))}
                      {routine.routine_exercises.length > 3 && (
                        <li className="text-xs text-[color:var(--text-soft)]">
                          +{routine.routine_exercises.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </section>

      {viewingRoutine && (
        <RoutineViewModal
          routineName={viewingRoutine.name}
          exercises={viewingRoutine.routine_exercises}
          createdAt={viewingRoutine.created_at}
          onClose={() => setViewingRoutine(null)}
        />
      )}
    </main>
  )
}
