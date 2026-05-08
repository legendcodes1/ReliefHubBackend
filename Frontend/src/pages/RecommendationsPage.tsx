import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { ExerciseCard } from '../features/recommendations/ExerciseCard'
import { getRecommendations } from '../features/recommendations/recommendationsApi'
import type { Exercise } from '../features/recommendations/recommendationTypes'
import RoutinePage from './RoutinePage'

export function RecommendationsPage() {
  const [searchParams] = useSearchParams()
  const bodyPartId = searchParams.get('bodyPartId')
  const discomfortTypeId = searchParams.get('discomfortTypeId')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRoutineExpanded, setIsRoutineExpanded] = useState(false)
  const hasFilters = Boolean(bodyPartId && discomfortTypeId)
  const recommendationsCount = exercises.length

  function getRecommendationCountLabel() {
    if (!hasFilters) {
      return 'Select filters to see recommendations'
    }

    if (isLoading) {
      return 'Finding exercises...'
    }

    if (error) {
      return 'Unable to load recommendations'
    }

    if (recommendationsCount === 0) {
      return 'No recommendations found yet'
    }

    if (recommendationsCount === 1) {
      return '1 recommendation found'
    }

    return `${recommendationsCount} recommendations found`
  }

  useEffect(() => {
    if (!hasFilters) {
      return
    }

    let isMounted = true

    async function loadRecommendations() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getRecommendations({ bodyPartId: bodyPartId as string, discomfortTypeId: discomfortTypeId as string })

        if (!result.response.ok) {
          throw new Error('Unable to fetch recommendations')
        }

        if (isMounted) {
          setExercises(result.data)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load recommendations right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadRecommendations()

    return () => {
      isMounted = false
    }
  }, [bodyPartId, discomfortTypeId, hasFilters])

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Recommendation Results</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Your Relief Plan</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Exercises matched to your selected body area and discomfort type.</p>
        <p className="mt-3 text-sm font-semibold text-[color:var(--text-body)]">
          {hasFilters && !isLoading && !error
            ? `Found ${recommendationsCount} ${recommendationsCount === 1 ? 'exercise' : 'exercises'} for you`
            : getRecommendationCountLabel()}
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/home" className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-body)] transition hover:bg-white">
            Adjust Filters
          </Link>
          <button
            type="button"
            onClick={() => setIsRoutineExpanded(!isRoutineExpanded)}
            className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-body)] transition hover:bg-white"
          >
            <span>Build Your Routine</span>
            {isRoutineExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </section>

      {isRoutineExpanded && (
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <RoutinePage />
        </div>
      )}
      {!hasFilters && (
        <p className="mt-4 rounded-xl bg-[color:var(--warning-soft)] p-3 text-sm text-[color:var(--warning-text)]">
          Missing filters. Please return to <Link to="/home" className="underline">home</Link> and select symptom options.
        </p>
      )}

      {isLoading && hasFilters && (
        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 text-sm text-[color:var(--text-soft)]">
          Finding exercises...
        </section>
      )}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && hasFilters && exercises.length === 0 && (
        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center">
          <p className="text-lg font-semibold text-[color:var(--text-strong)]">No exercises found for this combination yet.</p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">Try a different body area or discomfort type to widen your matches.</p>
        </section>
      )}

      {!isLoading && !error && exercises.length > 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
