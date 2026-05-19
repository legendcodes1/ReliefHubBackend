import { useEffect, useMemo, useState } from 'react'
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

type SortOption = 'popular' | 'newest' | 'shortest'

export function CommunityRoutinesPage() {
  const [routines, setRoutines] = useState<PublicRoutine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewingRoutine, setViewingRoutine] = useState<PublicRoutine | null>(null)
  const [favorites, setFavorites] = useState<Record<string, RoutineFavoriteStatus>>({})
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('popular')

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

  const routinesWithMeta = useMemo(() => {
    return routines.map((routine) => {
      const creator = getCreatorLabel(routine)
      const favorite = favorites[routine.id] ?? { isFavorited: false, count: 0 }
      const durationMinutes = routine.routine_exercises.reduce(
        (total, item) => total + (item.exercises.duration_minutes ?? 0),
        0,
      )
      const exerciseTitles = routine.routine_exercises.map(item => item.exercises.title)

      return {
        routine,
        creator,
        favorite,
        durationMinutes,
        exerciseTitles,
      }
    })
  }, [favorites, routines])

  const filteredAndSortedRoutines = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = query
      ? routinesWithMeta.filter(({ routine, creator, exerciseTitles }) => {
          const matchName = routine.name.toLowerCase().includes(query)
          const matchCreator = creator.toLowerCase().includes(query)
          const matchExercise = exerciseTitles.some(title => title.toLowerCase().includes(query))
          return matchName || matchCreator || matchExercise
        })
      : routinesWithMeta

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.routine.created_at).getTime() - new Date(a.routine.created_at).getTime()
      }

      if (sortBy === 'shortest') {
        return a.durationMinutes - b.durationMinutes
      }

      const favoriteDiff = b.favorite.count - a.favorite.count
      if (favoriteDiff !== 0) {
        return favoriteDiff
      }

      return new Date(b.routine.created_at).getTime() - new Date(a.routine.created_at).getTime()
    })

    return sorted
  }, [routinesWithMeta, searchQuery, sortBy])

  const totalExerciseCount = useMemo(
    () => routines.reduce((total, routine) => total + routine.routine_exercises.length, 0),
    [routines],
  )

  const mostSavedCount = useMemo(
    () => routinesWithMeta.reduce((highest, item) => Math.max(highest, item.favorite.count), 0),
    [routinesWithMeta],
  )

  const featuredRoutineId = useMemo(() => {
    const top = [...routinesWithMeta].sort((a, b) => {
      const favoriteDiff = b.favorite.count - a.favorite.count
      if (favoriteDiff !== 0) {
        return favoriteDiff
      }
      return new Date(b.routine.created_at).getTime() - new Date(a.routine.created_at).getTime()
    })[0]

    if (!top || top.favorite.count === 0) {
      return null
    }

    return top.routine.id
  }, [routinesWithMeta])

  function getInitials(name: string) {
    const trimmed = name.trim()
    if (!trimmed) {
      return 'RH'
    }

    const parts = trimmed.split(/\s+/)
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }

    return `${parts[0][0] ?? ''}${parts[1][0] ?? ''}`.toUpperCase()
  }

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Community</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Community Routines</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">
          Find routines shared by other ReliefHub users and quickly compare exercises, time, and community saves.
        </p>
        {!isLoading && !error && routines.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
              {routines.length} public routines
            </span>
            <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800">
              {totalExerciseCount} exercises shared
            </span>
            <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-amber-800">
              Top routine: {mostSavedCount} saves
            </span>
          </div>
        )}
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
          <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-3 sm:flex-row sm:items-center sm:justify-between">
            <label className="w-full sm:max-w-sm">
              <span className="sr-only">Search routines</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search routine, creator, or exercise"
                className="w-full rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm text-[color:var(--text-body)] placeholder:text-[color:var(--text-soft)] focus:border-emerald-400 focus:outline-none"
              />
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {([
                ['popular', 'Most saved'],
                ['newest', 'Newest'],
                ['shortest', 'Shortest'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSortBy(value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    sortBy === value
                      ? 'border-emerald-300 bg-emerald-100 text-emerald-900'
                      : 'border-[color:var(--line)] bg-white text-[color:var(--text-soft)] hover:bg-[color:var(--bg-soft)]'
                  }`}
                >
                  {label}
                </button>
              ))}

              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="rounded-full border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 transition hover:bg-stone-100"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {filteredAndSortedRoutines.length === 0 ? (
            <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-4 py-8 text-center">
              <p className="text-base font-semibold text-[color:var(--text-strong)]">No routines match your search</p>
              <p className="mt-1 text-sm text-[color:var(--text-soft)]">Try a different keyword or clear the search.</p>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="mt-3 rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredAndSortedRoutines.map(({ routine, creator, favorite, durationMinutes, exerciseTitles }) => (
              <article
                key={routine.id}
                onClick={() => setViewingRoutine(routine)}
                className="flex h-full cursor-pointer flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-[11px] font-semibold text-emerald-800">
                      {getInitials(creator)}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--text-strong)]">{creator}</p>
                      <p className="text-xs text-[color:var(--text-soft)]">{new Date(routine.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>

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

                {featuredRoutineId === routine.id && (
                  <span className="mb-3 inline-flex w-fit items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
                    Community favorite
                  </span>
                )}

                <h2 className="text-xl font-semibold leading-tight text-[color:var(--text-strong)]">{routine.name}</h2>

                <div className="mt-2 flex items-center gap-3 text-xs text-[color:var(--text-soft)]">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-emerald-800">
                    {routine.routine_exercises.length} exercises
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-cyan-800">
                    <Calendar className="h-3 w-3" />
                    {durationMinutes > 0 ? `~${durationMinutes} min` : 'Duration unknown'}
                  </span>
                </div>

                <div className="mt-4 border-t border-[color:var(--line)] pt-3">
                  <p className="text-xs font-medium text-[color:var(--text-soft)]">Exercise preview</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {exerciseTitles.slice(0, 3).map((title) => (
                      <span
                        key={`${routine.id}-${title}`}
                        className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white px-2 py-0.5 text-xs text-[color:var(--text-body)]"
                      >
                        {title}
                      </span>
                    ))}
                    {exerciseTitles.length > 3 && (
                      <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-white px-2 py-0.5 text-xs text-[color:var(--text-soft)]">
                        +{exerciseTitles.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between pt-4">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation()
                      setViewingRoutine(routine)
                    }}
                    className="rounded-lg border border-[color:var(--line)] bg-white px-3 py-1.5 text-xs font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]"
                  >
                    View routine
                  </button>
                  <span className="inline-flex items-center rounded-full border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-800">
                    Public
                  </span>
                </div>
              </article>
            ))}
            </div>
          )}
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
