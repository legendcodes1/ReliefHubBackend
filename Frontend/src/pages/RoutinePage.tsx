import { useEffect, useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Trash2, GripVertical, Save, Clock, Zap, Play, ChevronDown, ChevronRight } from 'lucide-react'
import { getAllExercises } from '../features/recommendations/recommendationsApi'
import { createRoutine } from '../features/routine/routineApi'
import type { Exercise } from '../features/recommendations/recommendationTypes'

const BODY_PART_MAP: Record<string, string> = {
  hand: 'Hand',
  wrist: 'Wrist',
  elbow: 'Elbow',
  shoulder: 'Shoulder',
  neck: 'Neck',
  back: 'Back',
  lower_back: 'Lower Back',
  hip: 'Hip',
  knee: 'Knee',
  ankle: 'Ankle',
  foot: 'Foot',
}

const getBodyPartName = (exercise: Exercise): string => {
  if (exercise.body_part_name) {
    return exercise.body_part_name
  }
  return BODY_PART_MAP[exercise.body_part_id] || exercise.body_part_id
}

export default function RoutinePage() {
  const navigate = useNavigate()
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [routineName, setRoutineName] = useState('')
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const bodyParts = useMemo(() => {
    const uniqueParts = new Map<string, { id: string; name: string }>()
    exercises.forEach((ex) => {
      if (!uniqueParts.has(ex.body_part_id)) {
        uniqueParts.set(ex.body_part_id, {
          id: ex.body_part_id,
          name: getBodyPartName(ex),
        })
      }
    })
    return Array.from(uniqueParts.values())
  }, [exercises])

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      setIsLoading(true)
      setError('')

      try {
        const result = await getAllExercises()

        if (!result.response.ok) {
          throw new Error('Unable to fetch exercises')
        }

        if (isMounted) {
          setExercises(result.data)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load data right now.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  function toggleSection(bodyPartId: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(bodyPartId)) {
        next.delete(bodyPartId)
      } else {
        next.add(bodyPartId)
      }
      return next
    })
  }

  function getExercisesByBodyPart(bodyPartId: string): Exercise[] {
    return exercises.filter((e) => e.body_part_id === bodyPartId)
  }

  function addToRoutine(exercise: Exercise) {
    if (!selectedExercises.find((e) => e.id === exercise.id)) {
      setSelectedExercises([...selectedExercises, exercise])
    }
  }

  function removeFromRoutine(exerciseId: string) {
    setSelectedExercises((current) => current.filter((e) => e.id !== exerciseId))
  }

  function moveExercise(index: number, direction: 'up' | 'down') {
    const newList = [...selectedExercises]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < newList.length) {
      const temp = newList[index]
      newList[index] = newList[newIndex]
      newList[newIndex] = temp
      setSelectedExercises(newList)
    }
  }

  async function handleSaveRoutine() {
    if (!routineName.trim()) {
      setSaveError('Please enter a name for your routine.')
      return
    }

    if (selectedExercises.length === 0) {
      setSaveError('Please add at least one exercise to your routine.')
      return
    }

    setIsSaving(true)
    setSaveError('')
    setSuccessMessage('')

    try {
      const exerciseIds = selectedExercises.map((e) => e.id)
      const result = await createRoutine(routineName.trim(), exerciseIds)

      if (!result.response.ok) {
        throw new Error('Unable to save routine')
      }

      setSuccessMessage('Routine saved successfully!')
      setRoutineName('')
      setSelectedExercises([])

      setTimeout(() => {
        navigate('/saved')
      }, 1500)
    } catch {
      setSaveError('Unable to save routine right now.')
    } finally {
      setIsSaving(false)
    }
  }

  const totalDuration = selectedExercises.reduce(
    (acc, e) => acc + (e.duration_minutes ?? 0),
    0
  )

  return (
    <main className="rounded-2xl bg-white p-6 sm:p-10 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Build Your Routine</h1>
      <p className="mt-2 text-base text-slate-500">
        Create a personalized workout routine from available exercises
      </p>

      {isLoading && (
        <div className="mt-10 flex flex-col items-center justify-center py-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-500" />
        </div>
      )}

      {error && (
        <p className="mt-8 rounded-xl bg-red-50 border border-red-100 p-5 text-base text-red-700">
          {error}
        </p>
      )}

      {!isLoading && !error && exercises.length === 0 && (
        <div className="mt-10 flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <span className="text-3xl">📋</span>
          </div>
          <p className="text-lg font-medium text-slate-700">No exercises available</p>
          <p className="mt-1 text-base text-slate-500">
            Check back later for available exercises
          </p>
          <Link
            to="/recommendations"
            className="mt-6 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-3 text-sm font-medium text-white shadow-md shadow-emerald-200 transition hover:shadow-lg"
          >
            Browse Recommendations
          </Link>
        </div>
      )}

      {!isLoading && !error && exercises.length > 0 && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Available Exercises</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select body part to view exercises, click + to add to routine
            </p>

            <div className="mt-4 space-y-3">
              {bodyParts.map((bodyPart) => {
                const exercisesList = getExercisesByBodyPart(bodyPart.id)
                if (exercisesList.length === 0) return null

                const isExpanded = expandedSections.has(bodyPart.id)

                return (
                  <div key={bodyPart.id} className="overflow-hidden rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => toggleSection(bodyPart.id)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-slate-50"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">
                          {bodyPart.name}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                          {exercisesList.length}
                        </span>
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-slate-400" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="border-t border-slate-200 bg-slate-50 p-3">
                        <div className="space-y-3">
                          {exercisesList.map((exercise) => {
                            const isInRoutine = selectedExercises.some(
                              (e) => e.id === exercise.id
                            )

                            return (
                              <article
                                key={exercise.id}
                                className={`group relative overflow-hidden rounded-lg border bg-white p-3 transition-all ${
                                  isInRoutine
                                    ? 'border-emerald-300'
                                    : 'border-slate-200'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <h3 className="text-sm font-semibold text-slate-900">
                                      {exercise.title ?? 'Untitled exercise'}
                                    </h3>
                                    <p className="mt-1 line-clamp-1 text-xs text-slate-600">
                                      {exercise.description ?? 'No description'}
                                    </p>
                                    <div className="mt-2 flex items-center gap-3 text-xs text-slate-500">
                                      {exercise.duration_minutes !== null &&
                                        exercise.duration_minutes !== undefined && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          {exercise.duration_minutes} min
                                        </span>
                                      )}
                                      {exercise.difficulty_level && (
                                        <span className="flex items-center gap-1">
                                          <Zap className="h-3 w-3" />
                                          {exercise.difficulty_level}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => addToRoutine(exercise)}
                                    disabled={isInRoutine}
                                    className={`ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${
                                      isInRoutine
                                        ? 'cursor-not-allowed bg-emerald-200 text-emerald-600'
                                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    }`}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2 className="text-lg font-semibold text-slate-900">Your Routine</h2>
            <p className="mt-1 text-sm text-slate-500">
              Arrange exercises and save your routine
            </p>

            <div className="mt-6">
              <label htmlFor="routine-name" className="block text-sm font-medium text-slate-700">
                Routine Name
              </label>
              <input
                type="text"
                id="routine-name"
                value={routineName}
                onChange={(e) => setRoutineName(e.target.value)}
                placeholder="e.g., Morning Stretch"
                className="mt-2 w-full rounded-lg border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {selectedExercises.length === 0 ? (
              <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 py-10 text-center">
                <Play className="h-10 w-10 text-slate-300" />
                <p className="mt-3 text-sm font-medium text-slate-600">
                  No exercises added yet
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Click + on exercises to add them
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                {selectedExercises.map((selected, index) => (
                  <div
                    key={selected.id}
                    className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'up')}
                        disabled={index === 0}
                        className="flex h-4 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <GripVertical className="h-3 w-3 rotate-90" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveExercise(index, 'down')}
                        disabled={index === selectedExercises.length - 1}
                        className="flex h-4 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-30"
                      >
                        <GripVertical className="h-3 w-3 -rotate-90" />
                      </button>
                    </div>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-600">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">
                        {selected.title ?? 'Untitled'}
                      </p>
                      {selected.duration_minutes !== null &&
                        selected.duration_minutes !== undefined && (
                          <p className="text-xs text-slate-500">
                            {selected.duration_minutes} min
                          </p>
                        )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromRoutine(selected.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedExercises.length > 0 && (
              <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <span className="text-sm font-medium text-slate-700">
                  Total Duration
                </span>
                <span className="text-sm text-slate-600">{totalDuration} min</span>
              </div>
            )}

            {saveError && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {saveError}
              </p>
            )}

            {successMessage && (
              <p className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                {successMessage}
              </p>
            )}

            <button
              type="button"
              onClick={handleSaveRoutine}
              disabled={isSaving}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-sm font-medium text-white shadow-md shadow-emerald-200 transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? (
                'Saving...'
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Routine
                </span>
              )}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}