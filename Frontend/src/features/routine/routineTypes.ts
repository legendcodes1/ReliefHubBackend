import type { Exercise } from '../recommendations/recommendationTypes'

export type Routine = {
  id: string
  user_id: string
  name: string
  exercise_ids: string[]
  created_at: string
}

export type RoutineExercise = {
  exercise: Exercise
  order: number
}

export type RoutineWithExercises = Routine & {
  exercises: RoutineExercise[]
}