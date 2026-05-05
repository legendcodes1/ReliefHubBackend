import { requestJson } from '../../lib/apiClient'
import type { SavedExercise } from './savedExerciseTypes'

export async function getSavedExercises() {
  return requestJson<SavedExercise[]>('/api/v1/saved-exercises', {
    withAuth: true,
  })
}

export async function saveExercise(exerciseId: string) {
  return requestJson<SavedExercise>('/api/v1/saved-exercises', {
    method: 'POST',
    withAuth: true,
    body: { exercise_id: exerciseId },
  })
}

export async function deleteSavedExercise(savedExerciseId: string) {
  return requestJson<{ message?: string }>(`/api/v1/saved-exercises/${savedExerciseId}`, {
    method: 'DELETE',
    withAuth: true,
  })
}
