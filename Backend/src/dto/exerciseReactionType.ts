export type ReactionType = 'like' | 'dislike'

export interface SetReactionDto {
  exercise_id: string
  reaction_type: ReactionType
}

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
