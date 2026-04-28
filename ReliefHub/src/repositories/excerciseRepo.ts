import { CreateExerciseDto, UpdateExerciseDto } from "../dto/excersiseType.js"
import { prisma } from "../lib/prisma.js"

export const getExerciseRepo = async () => {
    return prisma.exercises.findMany()
}

export const createExerciseRepo = async (data: CreateExerciseDto) => {
  return prisma.exercises.create({
    data: {
      ...data,
    },
  })
}

export const updateExerciseRepo = async (id: string, data: UpdateExerciseDto) => {
  return prisma.exercises.update({
    where: { id },
    data: { ...data },
  })
}

export const deleteExerciseRepo = async (id: string) => {
  return prisma.exercises.delete({
    where: { id },
  })
}
