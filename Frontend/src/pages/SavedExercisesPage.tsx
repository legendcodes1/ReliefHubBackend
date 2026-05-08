import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteSavedExercise, getSavedExercises } from '../features/saved-exercises/savedExercisesApi'
import type { SavedExercise } from '../features/saved-exercises/savedExerciseTypes'

export function SavedExercisesPage() {
  const [savedExercises, setSavedExercises] = useState<SavedExercise[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadSavedExercises() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getSavedExercises()
        if (!result.response.ok) {
          throw new Error('Unable to fetch saved exercises')
        }

        if (isMounted) {
          setSavedExercises(result.data)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load saved exercises right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSavedExercises()

    return () => {
      isMounted = false
    }
  }, [])

  async function handleDelete(savedExerciseId: string) {
    const previous = savedExercises
    setSavedExercises((current) => current.filter((item) => item.id !== savedExerciseId))

    try {
      const result = await deleteSavedExercise(savedExerciseId)
      if (!result.response.ok) {
        setSavedExercises(previous)
        setError('Unable to remove saved exercise right now.')
      }
    } catch {
      setSavedExercises(previous)
      setError('Unable to remove saved exercise right now.')
    }
  }

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Your Recovery Library</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Saved Exercises</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Revisit routines that worked for you and build consistency over time.</p>
        {!isLoading && !error && (
          <p className="mt-3 text-sm font-semibold text-[color:var(--text-body)]">
            You have {savedExercises.length} saved {savedExercises.length === 1 ? 'exercise' : 'exercises'}
          </p>
        )}
      </section>

      {isLoading && <p className="mt-4 text-sm text-[color:var(--text-soft)]">Loading saved exercises...</p>}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && savedExercises.length === 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center shadow-sm">
          <div className="mx-auto max-w-xl rounded-2xl border border-[color:var(--line)] bg-[linear-gradient(180deg,_#f8fbf8_0%,_#edf6f2_100%)] p-6">
            <p className="text-lg font-semibold text-[color:var(--text-strong)]">No saved exercises yet</p>
            <p className="mt-2 text-sm text-[color:var(--text-soft)]">Browse recommendations and save routines you want to repeat.</p>
            <Link to="/home" className="mt-4 inline-flex rounded-xl bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]">
              Find Exercises
            </Link>
          </div>
        </section>
      )}

      {!isLoading && !error && savedExercises.length > 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {savedExercises.map((saved) => (
            <article key={saved.id} className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800">
                  Saved
                </span>
                <span className="text-[11px] text-[color:var(--text-soft)]">Exercise</span>
              </div>
              <h2 className="text-lg font-semibold text-[color:var(--text-strong)]">{saved.exercises?.title ?? 'Untitled exercise'}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-body)]">{saved.exercises?.description ?? 'No description available.'}</p>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <Link to={`/exercises/${saved.exercise_id}`} className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]">
                  View Details
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(saved.id)}
                  className="rounded-xl bg-[color:var(--text-strong)] px-3 py-1.5 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Remove
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
