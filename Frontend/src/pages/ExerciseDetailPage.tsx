import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ExerciseVideo } from '../features/recommendations/ExerciseVideo'
import { getExerciseById } from '../features/recommendations/recommendationsApi'
import type { Exercise } from '../features/recommendations/recommendationTypes'

export function ExerciseDetailPage() {
  const { id } = useParams()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(id ? '' : 'Exercise id is missing.')

  useEffect(() => {
    const exerciseId = id

    if (!exerciseId) {
      return
    }

    let isMounted = true

    async function loadExercise() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getExerciseById(exerciseId!)
        if (!result.response.ok) {
          throw new Error('Unable to fetch exercise')
        }

        if (isMounted) {
          setExercise(result.data)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load exercise detail right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadExercise()

    return () => {
      isMounted = false
    }
  }, [id])

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Exercise Guidance</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Exercise Detail</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Review the movement details and complete each step gently.</p>
      </section>

      {isLoading && <p className="mt-3 text-sm text-[color:var(--text-soft)]">Loading exercise details...</p>}
      {error && <p className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && exercise && (
        <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
            <div className="mb-4 h-1.5 w-28 rounded-full bg-[linear-gradient(90deg,_#10b981_0%,_#06b6d4_100%)]" />
            <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">{exercise.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--text-body)]">{exercise.description}</p>

            <ExerciseVideo videoUrl={exercise.video_url} title={exercise.title} className="mt-4" />

            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {exercise.duration_minutes !== null && exercise.duration_minutes !== undefined && (
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200/70 text-[9px] font-semibold text-emerald-900">m</span>
                  {exercise.duration_minutes} min
                </span>
              )}
              {exercise.difficulty_level && (
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200/70 text-[9px] font-semibold text-cyan-900">d</span>
                  {exercise.difficulty_level}
                </span>
              )}
              {exercise.video_url && (
                <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-violet-900">
                  <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-violet-200/70 text-[9px] font-semibold text-violet-900">v</span>
                  Video
                </span>
              )}
            </div>

              {exercise.safety_notes && <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">Safety: {exercise.safety_notes}</p>}

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs text-stone-500">Before You Start</p>
                <p className="mt-1 text-sm text-stone-700">Warm up gently and keep movement ranges comfortable.</p>
              </div>
              <div className="rounded-xl border border-stone-200 bg-stone-50 p-3">
                <p className="text-xs text-stone-500">When To Stop</p>
                <p className="mt-1 text-sm text-stone-700">Stop if pain gets sharp, radiates, or you feel unstable.</p>
              </div>
            </div>

            {exercise.video_url && (
              <a href={exercise.video_url} target="_blank" rel="noreferrer" className="mt-4 inline-block rounded-lg border border-stone-300 px-3 py-1.5 text-sm text-stone-800 transition hover:bg-stone-100">
                Open Video
              </a>
            )}
          </article>

          <aside className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5">
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-emerald-800">Movement Reminder</p>
              <p className="mt-2 text-sm text-stone-700">Keep your breathing steady and avoid forcing range of motion.</p>
            </div>
            <div className="mt-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-cyan-800">Consistency Tip</p>
              <p className="mt-2 text-sm text-stone-700">Short daily sessions often work better than occasional long routines.</p>
            </div>
          </aside>
        </section>
      )}
    </main>
  )
}
