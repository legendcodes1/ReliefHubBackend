import { requestJson } from '../../lib/apiClient'
import type { PublicRoutine } from './routineTypes'

export type RoutineFavoriteStatus = {
  isFavorited: boolean
  count: number
}

export type BatchRoutineFavoriteStatus = Record<string, RoutineFavoriteStatus>

export type FavoriteRoutine = {
  id: string
  user_id: string
  routine_id: string
  created_at: string
  routines: PublicRoutine
}

export async function getRoutineFavoriteStatus(routineIds: string[]) {
  if (!routineIds.length) return { response: new Response(), data: {} as BatchRoutineFavoriteStatus }

  return requestJson<BatchRoutineFavoriteStatus>('/api/v1/routine-favorites/status', {
    withAuth: true,
    query: { ids: routineIds.join(',') },
  })
}

export async function favoriteRoutine(routineId: string) {
  return requestJson<RoutineFavoriteStatus>('/api/v1/routine-favorites', {
    withAuth: true,
    method: 'POST',
    body: { routine_id: routineId },
  })
}

export async function removeFavoriteRoutine(routineId: string) {
  return requestJson<RoutineFavoriteStatus>(`/api/v1/routine-favorites/${routineId}`, {
    withAuth: true,
    method: 'DELETE',
  })
}

export async function getFavoriteRoutines() {
  return requestJson<FavoriteRoutine[]>('/api/v1/routine-favorites', {
    withAuth: true,
  })
}
