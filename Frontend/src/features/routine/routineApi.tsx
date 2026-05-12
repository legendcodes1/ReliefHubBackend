import { requestJson } from '../../lib/apiClient'
import type { Routine, RoutineWithExercises } from './routineTypes'

export async function getRoutines() {
  return requestJson<Routine[]>('/api/v1/routines', {
    withAuth: true,
  })
}

export async function getRoutineById(id: string) {
  return requestJson<RoutineWithExercises>(`/api/v1/routines/${id}`, {
    withAuth: true,
  })
}

export async function createRoutine(name: string, exerciseIds: string[]) {
  return requestJson<Routine>('/api/v1/routines', {
    withAuth: true,
    method: 'POST',
    body: { name, exercise_ids: exerciseIds },
  })
}

export async function deleteRoutine(id: string) {
  return requestJson<{ message?: string }>(`/api/v1/routines/${id}`, {
    withAuth: true,
    method: 'DELETE',
  })
}

export async function updateRoutine(id: string, name: string, exerciseIds: string[]) {
  return requestJson<Routine>(`/api/v1/routines/${id}`, {
    withAuth: true,
    method: 'PUT',
    body: { name, exercise_ids: exerciseIds },
  })
}
