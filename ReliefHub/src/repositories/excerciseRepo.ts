import excersiseType from "../dto/excersiseType.js"
import { prisma } from "../lib/prisma.js"

export const getExerciseRepo = async () => {
    return prisma.exercises.findMany()
}


export const createExerciseRepo = async (data: excersiseType) => {
    return prisma.exercises.create({
      data: {
        ...data,
      }})
}

export const updateExerciseRepo = async (id: string, data: excersiseType) => {
    return await prisma.exercises.update({
      where: { id },
      data: {...data },
 
    })
}

export const deleteExerciseRepo = async (id: string) => {
    return await prisma.exercises.delete({
      where: { id },

    })}