import { requestJson } from '../../lib/apiClient'
import type { Exercise } from './recommendationTypes'

type RecommendationFilters = {
  bodyPartId: string
  discomfortTypeId: string
}

export async function getAllExercises() {
  return requestJson<Exercise[]>('/api/v1/exercises', {
    withAuth: true,
  })
}

export async function getRecommendations(filters: RecommendationFilters) {
  return requestJson<Exercise[]>('/api/v1/exercises/recommendations', {
    withAuth: true,
    query: filters,
  })
}

export async function getExerciseById(id: string) {
  return requestJson<Exercise>(`/api/v1/exercises/${id}`, {
    withAuth: true,
  })
}
