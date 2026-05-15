import { useEffect, useState } from 'react'
import { Calendar } from 'lucide-react'
import { RoutineViewModal } from '../features/routine/RoutineViewModal'
import { getPublicRoutines } from '../features/routine/routineApi'
import type { PublicRoutine } from '../features/routine/routineTypes'
import {
  favoriteRoutine,
  getRoutineFavoriteStatus,
  removeFavoriteRoutine,
} from '../features/routine/routineFavoritesApi'
import type { RoutineFavoriteStatus } from '../features/routine/routineFavoritesApi'

export function CommunityRoutinesPage() {
  const [routines, setRoutines] = useState<PublicRoutine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingRoutine, setViewingRoutine] = useState<PublicRoutine | null>(null)
  const [favorites, setFavorites] = useState<Record<string, RoutineFavoriteStatus>>({})

  useEffect(() => {
    let isMounted = true

    async function loadRoutines() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getPublicRoutines()
        if (!result.response.ok) {
          throw new Error('Unable to fetch public routines')
        }

        if (isMounted) {
          setRoutines(result.data)
        }

        const routineIds = result.data.map(routine => routine.id)
        if (routineIds.length) {
          try {
            const favoriteResult = await getRoutineFavoriteStatus(routineIds)
            if (isMounted) {
              setFavorites(favoriteResult.data)
            }
          } catch {
            // favorites are optional
          }
        }
      } catch {
        if (isMounted) {
          setError('Unable to load community routines right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRoutines()

    return () => {
      isMounted = false
    }
  }, [])

  function getCreatorLabel(routine: PublicRoutine) {
    if (routine.users.username) {
      return routine.users.username
    }

    const emailPrefix = routine.users.email.split('@')[0]
    return emailPrefix || 'ReliefHub member'
  }

  async function handleFavoriteClick(routineId: string) {
    const current = favorites[routineId] ?? { isFavorited: false, count: 0 }
    const next = {
      isFavorited: !current.isFavorited,
      count: current.isFavorited ? Math.max(0, current.count - 1) : current.count + 1,
    }

    setFavorites(prev => ({
      ...prev,
      [routineId]: next,
    }))

    try {
      if (current.isFavorited) {
        await removeFavoriteRoutine(routineId)
      } else {
        await favoriteRoutine(routineId)
      }
    } catch {
      setFavorites(prev => ({
        ...prev,
        [routineId]: current,
      }))
    }
  }

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Community</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Community Routines</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Explore public routines shared by other ReliefHub users.</p>
      </section>

      {isLoading && <p className="mt-4 text-sm text-[color:var(--text-soft)]">Loading community routines...</p>}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && routines.length === 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center shadow-sm">
          <p className="text-lg font-semibold text-[color:var(--text-strong)]">No public routines yet</p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">When users share routines publicly, they will appear here.</p>
        </section>
      )}

      {!isLoading && !error && routines.length > 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {routines.map((routine) => (
              <article
                key={routine.id}
                onClick={() => setViewingRoutine(routine)}
                className="flex h-full cursor-pointer flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {(() => {
                  const favorite = favorites[routine.id] ?? { isFavorited: false, count: 0 }

                  return (
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-800">
                    Public
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[color:var(--text-soft)]">
                      {routine.routine_exercises.length} exercises
                    </span>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleFavoriteClick(routine.id)
                      }}
                      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium transition ${
                        favorite.isFavorited
                          ? 'border-amber-200 bg-amber-50 text-amber-800'
                          : 'border-stone-200 bg-white text-stone-600 hover:bg-amber-50 hover:text-amber-800'
                      }`}
                      aria-pressed={favorite.isFavorited}
                      aria-label={favorite.isFavorited ? 'Remove favorite' : 'Favorite routine'}
                      title={favorite.isFavorited ? 'Favorited' : 'Favorite'}
                    >
                      <span>{favorite.isFavorited ? '★' : '☆'}</span>
                      <span className="tabular-nums">{favorite.count}</span>
                    </button>
                  </div>
                </div>
                  )
                })()}

                <h2 className="text-lg font-semibold text-[color:var(--text-strong)]">{routine.name}</h2>
                <p className="mt-1 text-sm text-[color:var(--text-soft)]">By {getCreatorLabel(routine)}</p>

                <div className="mt-3 flex items-center gap-3 text-xs text-[color:var(--text-soft)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(routine.created_at).toLocaleDateString()}
                  </span>
                </div>

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
            ))}
          </div>
        </section>
      )}

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
