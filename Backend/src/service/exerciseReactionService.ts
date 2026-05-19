import type {
  ReactionType,
  ExerciseReactionResponse,
  BatchReactionResponse,
} from '../dto/exerciseReactionType.js'
import {
  findUserReaction,
  countReactionsByExercise,
  countReactionsForMultiple,
  findUserReactionsForExercises,
  upsertReaction,
  deleteReaction,
} from '../repositories/exerciseReactionRepo.js'
import { prisma } from '../lib/prisma.js'

export class ReactionServiceError extends Error {
  statusCode: number

  constructor(message: string, statusCode: number) {
    super(message)
    this.statusCode = statusCode
  }
}

const VALID_REACTIONS: ReactionType[] = ['like', 'dislike']

export const setReaction = async (userId: string, exerciseId: string, reactionType: ReactionType) => {
  if (!userId?.trim()) throw new ReactionServiceError('user_id is required', 400)
  if (!exerciseId?.trim()) throw new ReactionServiceError('exercise_id is required', 400)
  if (!VALID_REACTIONS.includes(reactionType)) {
    throw new ReactionServiceError('reaction_type must be "like" or "dislike"', 400)
  }

  const exercise = await prisma.exercises.findUnique({ where: { id: exerciseId } })
  if (!exercise) throw new ReactionServiceError('Exercise not found', 404)

  await upsertReaction(userId, exerciseId, reactionType)

  return getReactionData(userId, exerciseId)
}

export const removeReaction = async (userId: string, exerciseId: string) => {
  if (!userId?.trim()) throw new ReactionServiceError('user_id is required', 400)
  if (!exerciseId?.trim()) throw new ReactionServiceError('exercise_id is required', 400)

  const existing = await findUserReaction(userId, exerciseId)
  if (!existing) return null

  await deleteReaction(userId, exerciseId)
  return getReactionData(userId, exerciseId)
}

export const getReactionData = async (userId: string, exerciseId: string): Promise<ExerciseReactionResponse> => {
  const [counts, userReaction] = await Promise.all([
    countReactionsByExercise(exerciseId),
    findUserReaction(userId, exerciseId),
  ])

  return {
    counts,
    userReaction: (userReaction?.reaction_type as ReactionType) ?? null,
  }
}

export const getBatchReactions = async (
  userId: string,
  exerciseIds: string[]
): Promise<BatchReactionResponse> => {
  if (!exerciseIds.length) return {}

  const [counts, userReactions] = await Promise.all([
    countReactionsForMultiple(exerciseIds),
    findUserReactionsForExercises(userId, exerciseIds),
  ])

  const result: BatchReactionResponse = {}
  for (const id of exerciseIds) {
    result[id] = {
      counts: counts[id] ?? { like: 0, dislike: 0 },
      userReaction: userReactions[id] ?? null,
    }
  }

  return result
}
