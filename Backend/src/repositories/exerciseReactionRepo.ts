import { prisma } from '../lib/prisma.js'
import type { ReactionType } from '../dto/exerciseReactionType.js'

export const findUserReaction = async (userId: string, exerciseId: string) => {
  return prisma.exercise_reactions.findUnique({
    where: {
      user_id_exercise_id: {
        user_id: userId,
        exercise_id: exerciseId,
      },
    },
  })
}

export const countReactionsByExercise = async (exerciseId: string) => {
  const results = await prisma.exercise_reactions.groupBy({
    by: ['reaction_type'],
    where: { exercise_id: exerciseId },
    _count: { reaction_type: true },
  })

  return {
    like: results.find(r => r.reaction_type === 'like')?._count.reaction_type ?? 0,
    dislike: results.find(r => r.reaction_type === 'dislike')?._count.reaction_type ?? 0,
  }
}

export const countReactionsForMultiple = async (exerciseIds: string[]) => {
  const results = await prisma.exercise_reactions.groupBy({
    by: ['reaction_type', 'exercise_id'],
    where: { exercise_id: { in: exerciseIds } },
    _count: { reaction_type: true },
  })

  const counts: Record<string, { like: number; dislike: number }> = {}
  for (const id of exerciseIds) {
    counts[id] = { like: 0, dislike: 0 }
  }

  for (const r of results) {
    if (r.reaction_type === 'like') {
      counts[r.exercise_id].like = r._count.reaction_type
    } else if (r.reaction_type === 'dislike') {
      counts[r.exercise_id].dislike = r._count.reaction_type
    }
  }

  return counts
}

export const findUserReactionsForExercises = async (userId: string, exerciseIds: string[]) => {
  const reactions = await prisma.exercise_reactions.findMany({
    where: {
      user_id: userId,
      exercise_id: { in: exerciseIds },
    },
  })

  const result: Record<string, ReactionType> = {}
  for (const r of reactions) {
    result[r.exercise_id] = r.reaction_type as ReactionType
  }
  return result
}

export const upsertReaction = async (userId: string, exerciseId: string, reactionType: ReactionType) => {
  return prisma.exercise_reactions.upsert({
    where: {
      user_id_exercise_id: {
        user_id: userId,
        exercise_id: exerciseId,
      },
    },
    create: {
      user_id: userId,
      exercise_id: exerciseId,
      reaction_type: reactionType,
    },
    update: {
      reaction_type: reactionType,
    },
  })
}

export const deleteReaction = async (userId: string, exerciseId: string) => {
  return prisma.exercise_reactions.delete({
    where: {
      user_id_exercise_id: {
        user_id: userId,
        exercise_id: exerciseId,
      },
    },
  })
}
