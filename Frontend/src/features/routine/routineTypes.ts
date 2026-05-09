import type { Exercise } from '../recommendations/recommendationTypes'

export type RoutineExercise = {
  id: string
  routine_id: string
  exercise_id: string
  created_at: string | null
  position: number
  exercises: Exercise
}

export type Routine = {
  id: string
  user_id: string
  name: string
  created_at: string
  updated_at: string
  routine_exercises: RoutineExercise[]
}

export type RoutineWithExercises = Routine
