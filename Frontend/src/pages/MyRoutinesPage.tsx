import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Trash2, Calendar, Pencil } from 'lucide-react'
import { getRoutines, deleteRoutine } from '../features/routine/routineApi'
import { RoutineEditModal } from '../features/routine/RoutineEditModal'
import { RoutineViewModal } from '../features/routine/RoutineViewModal'
import type { Routine } from '../features/routine/routineTypes'

export function MyRoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null)
  const [viewingRoutine, setViewingRoutine] = useState<Routine | null>(null)

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
          setRoutines(result.data)
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

  async function handleDelete(routineId: string) {
    const routine = routines.find((r) => r.id === routineId)
    if (!routine) return

    setDeletingId(routineId)
    const previous = routines
    setRoutines((current) => current.filter((r) => r.id !== routineId))

    try {
      const result = await deleteRoutine(routine.id)
      if (!result.response.ok) {
        setRoutines(previous)
        setError('Unable to delete routine right now.')
      }
    } catch {
      setRoutines(previous)
      setError('Unable to delete routine right now.')
    } finally {
      setDeletingId(null)
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
                key={routine.id}
                onClick={() => setViewingRoutine(routine)}
                className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                      Routine
                    </span>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        routine.is_public
                          ? 'border border-cyan-200 bg-cyan-50 text-cyan-800'
                          : 'border border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {routine.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                  <span className="text-[11px] text-[color:var(--text-soft)]">
                    {routine.routine_exercises.length} exercises
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-[color:var(--text-strong)]">
                  {routine.name}
                </h2>
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
                <div className="mt-auto flex items-center gap-2 pt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => setEditingRoutine(routine)}
                    className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-body)] transition hover:bg-[color:var(--bg-soft)]"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(routine.id)}
                    disabled={deletingId === routine.id}
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

      {editingRoutine && (
        <RoutineEditModal
          routineId={editingRoutine.id}
          initialName={editingRoutine.name}
          initialIsPublic={editingRoutine.is_public}
          initialExercises={editingRoutine.routine_exercises}
          onClose={() => setEditingRoutine(null)}
          onSave={({ name, exercises, isPublic }) => {
            setRoutines((prev) =>
              prev.map((r) =>
                r.id === editingRoutine.id
                  ? { ...r, name, is_public: isPublic, routine_exercises: exercises }
                  : r
              )
            )
          }}
        />
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
