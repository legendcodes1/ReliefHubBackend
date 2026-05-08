import type { Exercise } from '../recommendations/recommendationTypes'

export type SavedExercise = {
  id: string
  user_id: string
  exercise_id: string
  exercises: Exercise
}
