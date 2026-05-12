import { X, Calendar, Clock } from 'lucide-react'
import type { RoutineExercise } from './routineTypes'

interface RoutineViewModalProps {
  routineName: string
  exercises: RoutineExercise[]
  createdAt: string
  onClose: () => void
}

export function RoutineViewModal({ routineName, exercises, createdAt, onClose }: RoutineViewModalProps) {
  const totalDuration = exercises.reduce(
    (acc, ex) => acc + (ex.exercises.duration_minutes ?? 0),
    0
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="mx-4 w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{routineName}</h2>
            <div className="mt-1 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(createdAt).toLocaleDateString()}
              </span>
              {totalDuration > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {totalDuration} min
                </span>
              )}
              <span>{exercises.length} exercises</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(90vh - 100px)' }}>
          {exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-slate-500">No exercises in this routine</p>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((routineExercise, index) => {
                const exercise = routineExercise.exercises

                return (
                  <article
                    key={routineExercise.id}
                    className="flex flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-5 shadow-sm"
                  >
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
                        {index + 1}
                      </span>
                      <h3 className="text-lg font-semibold text-[color:var(--text-strong)]">{exercise.title}</h3>
                    </div>

                    {exercise.video_url && (
                      <a
                        href={`/exercises/${exercise.id}`}
                        className="group mb-4 block overflow-hidden rounded-xl border border-[color:var(--line)] bg-stone-100"
                      >
                        <div className="relative aspect-video">
                          <img
                            src={`https://img.youtube.com/vi/${exercise.video_url}/hqdefault.jpg`}
                            alt={`${exercise.title} video preview`}
                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-stone-950/20 transition group-hover:bg-stone-950/30" />
                          <span className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-md transition group-hover:scale-105 group-hover:bg-white">
                            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-6 w-6">
                              <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
                              <path d="M8.5 7.6v4.8l4-2.4-4-2.4Z" fill="currentColor" />
                            </svg>
                          </span>
                        </div>
                      </a>
                    )}

                    <p className="text-sm leading-relaxed text-[color:var(--text-body)]">{exercise.description}</p>

                    <div className="mt-4 flex flex-wrap gap-2 text-xs">
                      {exercise.duration_minutes !== null && exercise.duration_minutes !== undefined && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
                          <Clock className="h-3 w-3" />
                          {exercise.duration_minutes} min
                        </span>
                      )}
                      {exercise.difficulty_level && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800">
                          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3 w-3">
                            <path d="M4 13.5h2.2M8.3 10.5h3M13.4 7.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M3.8 13.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM8 10.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM13.1 7.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z" fill="currentColor" />
                          </svg>
                          {exercise.difficulty_level}
                        </span>
                      )}
                    </div>

                    {exercise.safety_notes && (
                      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">Safety Note</p>
                        <p className="mt-1 text-xs text-amber-900">{exercise.safety_notes}</p>
                      </div>
                    )}
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}