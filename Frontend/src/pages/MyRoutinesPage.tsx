import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, Calendar, Clock } from 'lucide-react'
import { getRoutines, deleteRoutine } from '../features/routine/routineApi'
import type { Exercise } from '../features/recommendations/recommendationTypes'

interface RoutineEntry {
  id: string
  user_id: string
  exercise_id: string
  completed_at: string
  notes: string | null
  exercises: Exercise
}

interface GroupedRoutine {
  name: string
  entries: RoutineEntry[]
  createdAt: string
}

export function MyRoutinesPage() {
  const navigate = useNavigate()
  const [routines, setRoutines] = useState<GroupedRoutine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadRoutines() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getRoutines()
        if (!result.response.ok) {
          throw new Error('Unable to fetch routines')
        }

        if (isMounted) {
          const entries: RoutineEntry[] = result.data
          const grouped = groupRoutinesByName(entries)
          setRoutines(grouped)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load routines right now.')
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

  function groupRoutinesByName(entries: RoutineEntry[]): GroupedRoutine[] {
    const groups: Record<string, GroupedRoutine> = {}

    entries.forEach((entry) => {
      const name = entry.notes || 'Untitled Routine'
      if (!groups[name]) {
        groups[name] = {
          name,
          entries: [],
          createdAt: entry.completed_at,
        }
      }
      groups[name].entries.push(entry)
      if (new Date(entry.completed_at) < new Date(groups[name].createdAt)) {
        groups[name].createdAt = entry.completed_at
      }
    })

    return Object.values(groups).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  async function handleDelete(routineName: string) {
    const routine = routines.find((r) => r.name === routineName)
    if (!routine) return

    const previous = routines
    setRoutines((current) => current.filter((r) => r.name !== routineName))

    try {
      for (const entry of routine.entries) {
        const result = await deleteRoutine(entry.id)
        if (!result.response.ok) {
          setRoutines(previous)
          setError('Unable to delete routine right now.')
          return
        }
      }
    } catch {
      setRoutines(previous)
      setError('Unable to delete routine right now.')
    }
  }

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Your Recovery</p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">My Routines</h1>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              View and manage your saved exercise routines
            </p>
          </div>
          <Link
            to="/routines"
            className="flex items-center gap-2 rounded-xl bg-[color:var(--brand)] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]"
          >
            <Plus className="h-4 w-4" />
            Build New
          </Link>
        </div>
        {!isLoading && !error && (
          <p className="mt-3 text-sm font-semibold text-[color:var(--text-body)]">
            {routines.length} {routines.length === 1 ? 'routine' : 'routines'}
          </p>
        )}
      </section>

      {isLoading && <p className="mt-4 text-sm text-[color:var(--text-soft)]">Loading routines...</p>}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && routines.length === 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center shadow-sm">
          <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(180deg,_#f8fbf8_0%,_#edf6f2_100%)] p-6">
            <p className="text-lg font-semibold text-[color:var(--text-strong)]">No routines yet</p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">
              Build your first routine from available exercises.
            </p>
            <Link
              to="/routines"
              className="mt-4 inline-flex rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]"
            >
              Build Routine
            </Link>
          </div>
        </section>
      )}

      {!isLoading && !error && routines.length > 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {routines.map((routine) => (
              <article
                key={routine.name}
                className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                    Routine
                  </span>
                  <span className="text-[11px] text-[color:var(--text-soft)]">
                    {routine.entries.length} exercises
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-[color:var(--text-strong)]">
                  {routine.name}
                </h2>
                <div className="mt-3 flex items-center gap-3 text-xs text-[color:var(--text-soft)]">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(routine.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-4 border-t border-[color:var(--line)] pt-3">
                  <p className="text-xs font-medium text-[color:var(--text-soft)]">Exercises:</p>
                  <ul className="mt-2 space-y-1">
                    {routine.entries.slice(0, 3).map((entry) => (
                      <li key={entry.id} className="text-sm text-[color:var(--text-body)]">
                        • {entry.exercises.title}
                      </li>
                    ))}
                    {routine.entries.length > 3 && (
                      <li className="text-xs text-[color:var(--text-soft)]">
                        +{routine.entries.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>
                <div className="mt-auto flex items-center gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(routine.name)}
                    disabled={deletingId === routine.name}
                    className="rounded-xl bg-[color:var(--text-strong)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </main>
  )
}