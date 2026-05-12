import { requestJson } from '../../lib/apiClient'

export type ReactionType = 'like' | 'dislike'

export interface ExerciseReactionResponse {
  counts: {
    like: number
    dislike: number
  }
  userReaction: ReactionType | null
}

export interface BatchReactionResponse {
  [exerciseId: string]: ExerciseReactionResponse
}

export async function setReaction(exerciseId: string, reactionType: ReactionType) {
  return requestJson<ExerciseReactionResponse>('/api/v1/exercise-reactions', {
    method: 'POST',
    withAuth: true,
    body: { exercise_id: exerciseId, reaction_type: reactionType },
  })
}

export async function removeReaction(exerciseId: string) {
  return requestJson<ExerciseReactionResponse | null>(`/api/v1/exercise-reactions/${exerciseId}`, {
    method: 'DELETE',
    withAuth: true,
  })
}

export async function getReaction(exerciseId: string) {
  return requestJson<ExerciseReactionResponse>(`/api/v1/exercise-reactions/${exerciseId}`, {
    withAuth: true,
  })
}

export async function getBatchReactions(exerciseIds: string[]) {
  if (!exerciseIds.length) return { response: new Response(), data: {} as BatchReactionResponse }
  return requestJson<BatchReactionResponse>('/api/v1/exercise-reactions', {
    withAuth: true,
    query: { ids: exerciseIds.join(',') },
  })
}
