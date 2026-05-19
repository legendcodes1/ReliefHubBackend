import { Request, Response } from 'express'
import { Prisma } from '../../generated/prisma/client.js'
import {
  setReaction,
  removeReaction,
  getReactionData,
  getBatchReactions,
  ReactionServiceError,
} from '../service/exerciseReactionService.js'
import type { SetReactionDto } from '../dto/exerciseReactionType.js'

const handleReactionError = (error: unknown, res: Response) => {
  if (error instanceof ReactionServiceError) {
    return res.status(error.statusCode).json({ message: error.message })
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Exercise not found' })
    }
  }

  console.error(error)
  return res.status(500).json({ message: 'Internal server error' })
}

export const setReactionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const { exercise_id, reaction_type } = req.body as SetReactionDto
    const result = await setReaction(userId, exercise_id, reaction_type)
    return res.status(200).json(result)
  } catch (error) {
    return handleReactionError(error, res)
  }
}

export const removeReactionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const exerciseId = req.params.exerciseId
    if (typeof exerciseId !== 'string' || !exerciseId.trim()) {
      return res.status(400).json({ message: 'exerciseId route parameter is required' })
    }

    const result = await removeReaction(userId, exerciseId)
    return res.status(200).json(result)
  } catch (error) {
    return handleReactionError(error, res)
  }
}

export const getReactionController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const exerciseId = req.params.exerciseId
    if (typeof exerciseId !== 'string' || !exerciseId.trim()) {
      return res.status(400).json({ message: 'exerciseId route parameter is required' })
    }

    const result = await getReactionData(userId, exerciseId)
    return res.status(200).json(result)
  } catch (error) {
    return handleReactionError(error, res)
  }
}

export const getBatchReactionsController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: 'Unauthorized' })

    const ids = req.query.ids
    if (typeof ids !== 'string') {
      return res.status(400).json({ message: 'ids query parameter must be a comma-separated string' })
    }

    const exerciseIds = ids.split(',').map(id => id.trim()).filter(Boolean)
    if (!exerciseIds.length) {
      return res.status(400).json({ message: 'ids must contain at least one exercise ID' })
    }

    const result = await getBatchReactions(userId, exerciseIds)
    return res.status(200).json(result)
  } catch (error) {
    return handleReactionError(error, res)
  }
}
