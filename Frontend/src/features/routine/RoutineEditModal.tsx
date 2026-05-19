import { useState, useEffect, useCallback } from 'react'
import { X, Plus, Trash2, GripVertical, ChevronDown, ChevronRight, Clock, Save, ArrowUp, ArrowDown } from 'lucide-react'
import { getAllExercises } from '../recommendations/recommendationsApi'
import { updateRoutine } from './routineApi'
import type { RoutineExercise } from './routineTypes'
import type { Exercise } from '../recommendations/recommendationTypes'

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

function getBodyPartName(exercise: Exercise): string {
  if (exercise.body_part_name) {
    return exercise.body_part_name
  }
  return BODY_PART_MAP[exercise.body_part_id] || exercise.body_part_id
}

interface RoutineEditModalProps {
  routineId: string
  initialName: string
  initialIsPublic: boolean
  initialExercises: RoutineExercise[]
  onClose: () => void
  onSave: (updatedRoutine: { name: string; exercises: RoutineExercise[]; isPublic: boolean }) => void
}

export function RoutineEditModal({ routineId, initialName, initialIsPublic, initialExercises, onClose, onSave }: RoutineEditModalProps) {
  const [name, setName] = useState(initialName)
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [exercises, setExercises] = useState<RoutineExercise[]>(initialExercises)
  const [allExercises, setAllExercises] = useState<Exercise[]>([])
  const [isLoadingExercises, setIsLoadingExercises] = useState(false)
  const [showAddExercises, setShowAddExercises] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  useEffect(() => {
    async function loadExercises() {
      setIsLoadingExercises(true)
      try {
        const result = await getAllExercises()
        if (result.response.ok) {
          setAllExercises(result.data)
        }
      } catch {
        // silently fail
      } finally {
        setIsLoadingExercises(false)
      }
    }
    loadExercises()
  }, [])

  const currentExerciseIds = new Set(exercises.map((e) => e.exercise_id))

  const availableExercises = allExercises.filter((e) => !currentExerciseIds.has(e.id))

  const bodyParts = availableExercises.reduce((acc, ex) => {
    const part = getBodyPartName(ex)
    if (!acc[part]) {
      acc[part] = []
    }
    acc[part].push(ex)
    return acc
  }, {} as Record<string, Exercise[]>)

  function toggleSection(bodyPart: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(bodyPart)) {
        next.delete(bodyPart)
      } else {
        next.add(bodyPart)
      }
      return next
    })
  }

  function addExercise(exercise: Exercise) {
    const newRoutineExercise: RoutineExercise = {
      id: `temp-${Date.now()}-${exercise.id}`,
      routine_id: routineId,
      exercise_id: exercise.id,
      created_at: null,
      position: exercises.length + 1,
      exercises: exercise,
    }
    setExercises([...exercises, newRoutineExercise])
  }

  function removeExercise(index: number) {
    setExercises((prev) => prev.filter((_, i) => i !== index))
  }

  function moveExercise(index: number, direction: -1 | 1) {
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= exercises.length) {
      return
    }

    const newExercises = [...exercises]
    const [moved] = newExercises.splice(index, 1)
    newExercises.splice(targetIndex, 0, moved)
    setExercises(newExercises.map((ex, i) => ({ ...ex, position: i + 1 })))
  }

  const handleDragStart = useCallback((index: number) => {
    setDraggedIndex(index)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
  }, [draggedIndex])

  const handleDrop = useCallback((targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null)
      return
    }
    const newExercises = [...exercises]
    const [dragged] = newExercises.splice(draggedIndex, 1)
    newExercises.splice(targetIndex, 0, dragged)
    setExercises(newExercises.map((ex, i) => ({ ...ex, position: i + 1 })))
    setDraggedIndex(null)
  }, [draggedIndex, exercises])

  async function handleSave() {
    if (!name.trim()) {
      setError('Please enter a name for your routine.')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const exerciseIds = exercises.map((e) => e.exercise_id)
      const result = await updateRoutine(routineId, name.trim(), exerciseIds, isPublic)

      if (!result.response.ok) {
        throw new Error('Failed to update routine')
      }

      onSave({
        name: result.data.name,
        exercises: result.data.routine_exercises,
        isPublic: result.data.is_public,
      })
      onClose()
    } catch {
      setError('Unable to save routine right now.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="mx-4 w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-slate-900">Edit Routine</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="space-y-5">
            <div>
              <label htmlFor="edit-routine-name" className="block text-sm font-medium text-slate-700">
                Routine Name
              </label>
              <input
                type="text"
                id="edit-routine-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Morning Stretch"
                className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-900 placeholder-slate-400 transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>
                <span className="block text-sm font-medium text-slate-800">Share publicly</span>
                <span className="mt-0.5 block text-xs text-slate-500">Allow other ReliefHub users to view this routine.</span>
              </span>
            </label>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Exercises</p>
                <span className="text-xs text-slate-500">{exercises.length} exercises</span>
              </div>

              {exercises.length === 0 ? (
                <div className="mt-3 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 py-8 text-center">
                  <p className="text-sm text-slate-500">No exercises yet</p>
                  <p className="mt-1 text-xs text-slate-400">Add exercises below</p>
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {exercises.map((routineExercise, index) => (
                    <div
                      key={routineExercise.id}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={() => handleDrop(index)}
                      className={`group flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 transition ${
                        draggedIndex === index ? 'opacity-50' : ''
                      }`}
                    >
                      <div
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        className="hidden cursor-grab text-slate-400 hover:text-slate-600 active:cursor-grabbing sm:block"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">
                          {routineExercise.exercises.title}
                        </p>
                        {routineExercise.exercises.duration_minutes && (
                          <p className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="h-3 w-3" />
                            {routineExercise.exercises.duration_minutes} min
                          </p>
                        )}
                      </div>
                      <div className="hidden sm:flex">
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-red-100 hover:text-red-600 transition"
                          aria-label={`Remove ${routineExercise.exercises.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex shrink-0 items-center gap-1 sm:hidden">
                        <button
                          type="button"
                          onClick={() => moveExercise(index, -1)}
                          disabled={index === 0}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
                          aria-label={`Move ${routineExercise.exercises.title} up`}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExercise(index, 1)}
                          disabled={index === exercises.length - 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 disabled:opacity-30"
                          aria-label={`Move ${routineExercise.exercises.title} down`}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExercise(index)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-100 hover:text-red-600"
                          aria-label={`Remove ${routineExercise.exercises.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAddExercises(!showAddExercises)}
                className="flex w-full items-center justify-between rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Exercises
                </span>
                {showAddExercises ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {showAddExercises && (
                <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
                  {isLoadingExercises ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500" />
                    </div>
                  ) : availableExercises.length === 0 ? (
                    <p className="text-center text-sm text-slate-500 py-4">
                      No more exercises available to add
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(bodyParts).map(([bodyPart, exercisesList]) => (
                        <div key={bodyPart} className="overflow-hidden rounded-lg border border-slate-200">
                          <button
                            type="button"
                            onClick={() => toggleSection(bodyPart)}
                            className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-slate-50"
                          >
                            <span className="text-sm font-medium text-slate-700">{bodyPart}</span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              {exercisesList.length}
                              {expandedSections.has(bodyPart) ? (
                                <ChevronDown className="h-3 w-3" />
                              ) : (
                                <ChevronRight className="h-3 w-3" />
                              )}
                            </span>
                          </button>
                          {expandedSections.has(bodyPart) && (
                            <div className="border-t border-slate-200 bg-slate-50 p-2">
                              {exercisesList.map((exercise) => (
                                <button
                                  key={exercise.id}
                                  type="button"
                                  onClick={() => addExercise(exercise)}
                                  className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                                >
                                  <span className="truncate">{exercise.title}</span>
                                  <Plus className="h-4 w-4 shrink-0 text-emerald-600" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
