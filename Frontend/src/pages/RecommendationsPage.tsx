import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { ExerciseCard } from '../features/recommendations/ExerciseCard'
import { getRecommendations } from '../features/recommendations/recommendationsApi'
import { getBatchReactions } from '../features/recommendations/reactionsApi'
import type { Exercise } from '../features/recommendations/recommendationTypes'
import type { ReactionType } from '../features/recommendations/reactionsApi'
import RoutinePage from './RoutinePage'

type ReactionCounts = {
  like: number
  dislike: number
}

type ReactionData = {
  counts: ReactionCounts
  userReaction: ReactionType | null
}

export function RecommendationsPage() {
  const [searchParams] = useSearchParams()
  const bodyPartId = searchParams.get('bodyPartId')
  const discomfortTypeId = searchParams.get('discomfortTypeId')
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isRoutineExpanded, setIsRoutineExpanded] = useState(false)
  const [reactions, setReactions] = useState<Record<string, ReactionData>>({})

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

  function handleReactionsChange(exerciseId: string, update: Partial<ReactionData>) {
    setReactions(prev => ({
      ...prev,
      [exerciseId]: {
        counts: prev[exerciseId]?.counts ?? { like: 0, dislike: 0 },
        userReaction: prev[exerciseId]?.userReaction ?? null,
        ...update,
      },
    }))
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
        const result = await getRecommendations({
          bodyPartId: bodyPartId as string,
          discomfortTypeId: discomfortTypeId as string,
        })

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

  useEffect(() => {
    if (!exercises.length) return

    let isMounted = true

    async function loadReactions() {
      try {
        const exerciseIds = exercises.map(e => e.id)
        const result = await getBatchReactions(exerciseIds)

        if (isMounted) {
          setReactions(result.data)
        }
      } catch {
        // silently fail — reactions are optional
      }
    }

    loadReactions()

    return () => {
      isMounted = false
    }
  }, [exercises])

  return (
    <main className="space-y-5">
      <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 shadow-sm sm:p-7">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[color:var(--accent)]">Step 2 of 3</p>
        <h1 className="mt-2 text-4xl font-semibold leading-tight text-[color:var(--text-strong)]">Your Relief Plan</h1>
        <p className="mt-2 text-sm text-[color:var(--text-soft)]">Based on your selected body area and discomfort type.</p>
        <p className="mt-3 text-sm font-semibold text-[color:var(--text-body)]">
          {hasFilters && !isLoading && !error
            ? `Found ${recommendationsCount} ${recommendationsCount === 1 ? 'exercise' : 'exercises'} for you`
            : getRecommendationCountLabel()}
        </p>
        <div className="mt-5 grid gap-2 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-4 sm:grid-cols-3">
          <p className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--text-strong)]">1. Review exercises</p>
          <p className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--text-strong)]">2. Save favorites</p>
          <p className="rounded-xl border border-[color:var(--line)] bg-white px-3 py-2 text-sm font-semibold text-[color:var(--text-strong)]">3. Build routine</p>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/home" className="inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-body)] transition hover:bg-white">
            Adjust Filters
          </Link>
        </div>
      </section>

      {!hasFilters && (
        <section className="rounded-2xl border border-amber-200 bg-[color:var(--warning-soft)] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[color:var(--warning-text)]">Missing filters</p>
          <p className="mt-2 text-sm text-[color:var(--warning-text)]">Choose your body area and discomfort type first to get matched recommendations.</p>
          <Link to="/home" className="mt-3 inline-flex rounded-full border border-amber-300 bg-white px-3 py-1.5 text-sm font-semibold text-[color:var(--warning-text)] transition hover:bg-amber-50">
            Start Your Relief Plan
          </Link>
        </section>
      )}

      {isLoading && hasFilters && (
        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 text-sm text-[color:var(--text-soft)]">
          Finding exercises...
        </section>
      )}
      {error && <p className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}

      {!isLoading && !error && hasFilters && exercises.length === 0 && (
        <section className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-6 text-center">
          <p className="text-lg font-semibold text-[color:var(--text-strong)]">No close matches yet.</p>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">Try adjusting your body area or discomfort type to find a better fit.</p>
          <Link to="/home" className="mt-4 inline-flex rounded-full border border-[color:var(--line)] bg-[color:var(--bg-soft)] px-3 py-1.5 text-sm font-semibold text-[color:var(--text-body)] transition hover:bg-white">
            Adjust Filters
          </Link>
          <p className="mt-2 text-xs text-[color:var(--text-soft)]">More exercises can be added later as the catalog grows.</p>
        </section>
      )}

      {!isLoading && !error && exercises.length > 0 && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {exercises.map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                reactions={reactions[exercise.id]}
                onReactionsChange={handleReactionsChange}
              />
            ))}
          </div>
        </section>
      )}

      {hasFilters && (
        <section className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--accent)]">Next Step</p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text-strong)]">Build your routine</h2>
          <p className="mt-2 text-sm text-[color:var(--text-soft)]">Turn your matched exercises into a simple routine you can follow consistently.</p>
          <button
            type="button"
            onClick={() => setIsRoutineExpanded(!isRoutineExpanded)}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--brand)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[color:var(--brand-strong)]"
          >
            <span>{isRoutineExpanded ? 'Hide Routine Builder' : 'Build Your Routine'}</span>
            {isRoutineExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </section>
      )}

      {isRoutineExpanded && hasFilters && (
        <div className="rounded-3xl border border-[color:var(--line)] bg-[color:var(--surface)] p-5 shadow-sm sm:p-6">
          <RoutinePage />
        </div>
      )}
    </main>
  )
}
