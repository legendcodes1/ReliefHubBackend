import { useState } from 'react'
import { Link } from 'react-router-dom'
import { saveExercise } from '../saved-exercises/savedExercisesApi'
import type { Exercise } from './recommendationTypes'
import { getYouTubeThumbnailUrl } from './youtube'

type ExerciseCardProps = {
  exercise: Exercise
}

const accentStyles = [
  {
    bar: 'bg-[linear-gradient(90deg,_#1e7a67_0%,_#0f7480_100%)]',
    title: 'border-emerald-100 bg-emerald-50/70',
  },
  {
    bar: 'bg-[linear-gradient(90deg,_#0f7480_0%,_#14b8a6_100%)]',
    title: 'border-cyan-100 bg-cyan-50/70',
  },
  {
    bar: 'bg-[linear-gradient(90deg,_#22a26a_0%,_#0f7480_100%)]',
    title: 'border-teal-100 bg-teal-50/70',
  },
]

function getAccentIndex(id: string) {
  const value = Number.parseInt(id.replace(/-/g, '').slice(-6), 16)
  if (Number.isNaN(value)) {
    return 0
  }
  return value % accentStyles.length
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3 w-3">
      <circle cx="10" cy="10" r="6.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.8v3.6l2.6 1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LevelIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-3 w-3">
      <path d="M4 13.5h2.2M8.3 10.5h3M13.4 7.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.8 13.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM8 10.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6ZM13.1 7.5a.8.8 0 1 0 0-1.6.8.8 0 0 0 0 1.6Z" fill="currentColor" />
    </svg>
  )
}

function PlayIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className={className}>
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8.5 7.6v4.8l4-2.4-4-2.4Z" fill="currentColor" />
    </svg>
  )
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')
  const accent = accentStyles[getAccentIndex(exercise.id)]
  const thumbnailUrl = getYouTubeThumbnailUrl(exercise.video_url)

  async function handleSave() {
    setIsSaving(true)
    setSaveMessage('')

    try {
      const result = await saveExercise(exercise.id)

      if (!result.response.ok) {
        setSaveMessage('Unable to save this exercise right now.')
        return
      }

      setSaveMessage('Saved.')
    } catch {
      setSaveMessage('Unable to save this exercise right now.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="flex h-full flex-col rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`mb-3 h-1.5 w-24 rounded-full ${accent.bar}`} />

      <div className={`mb-3 rounded-xl border px-3 py-2 ${accent.title}`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-semibold leading-tight text-[color:var(--text-strong)]">{exercise.title}</h3>
          {exercise.video_url && !thumbnailUrl && (
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
              <PlayIcon />
            </span>
          )}
        </div>
      </div>

      {thumbnailUrl && (
        <Link to={`/exercises/${exercise.id}`} className="group mb-4 block overflow-hidden rounded-xl border border-[color:var(--line)] bg-stone-100">
          <div className="relative aspect-video">
            <img src={thumbnailUrl} alt={`${exercise.title} video preview`} className="h-full w-full object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-stone-950/20 transition group-hover:bg-stone-950/30" />
            <span className="absolute left-1/2 top-1/2 inline-flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-emerald-700 shadow-md transition group-hover:scale-105 group-hover:bg-white">
              <PlayIcon className="h-6 w-6" />
            </span>
            {/* <span className="absolute bottom-2 left-2 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-stone-800 shadow-sm">
              View video details
            </span> */}
          </div>
        </Link>
      )}

      <p className="text-sm leading-relaxed text-[color:var(--text-body)]">{exercise.description}</p>

      <div className="mt-4 flex flex-wrap gap-2 text-xs">
        {exercise.duration_minutes !== null && exercise.duration_minutes !== undefined && (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-emerald-800">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-200/70 text-emerald-900"><ClockIcon /></span>
            {exercise.duration_minutes} min
          </span>
        )}
        {exercise.difficulty_level && (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-cyan-800">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-cyan-200/70 text-cyan-900"><LevelIcon /></span>
            {exercise.difficulty_level}
          </span>
        )}
        {exercise.video_url && (
          <span className="inline-flex items-center gap-1 rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-sky-900">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-sky-200/70 text-sky-900"><PlayIcon /></span>
            Video
          </span>
        )}
      </div>

      {exercise.safety_notes && (
        <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-800">Safety Note</p>
          <p className="mt-1 text-xs text-amber-900">{exercise.safety_notes}</p>
        </div>
      )}

      <div className="mt-auto flex items-center gap-2 pt-4">
        <Link to={`/exercises/${exercise.id}`} className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-1.5 text-sm font-medium text-[color:var(--text-strong)] transition hover:bg-[color:var(--bg-soft)]">
          View Details
        </Link>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-[color:var(--brand)] px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        {saveMessage && <span className="text-xs text-stone-600">{saveMessage}</span>}
      </div>
    </article>
  )
}
