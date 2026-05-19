import { SaveExerciseDTO } from "../dto/saveExerciseType.js";
import { prisma } from "../lib/prisma.js"


export const createSavedExerciesRepo = async (data: SaveExerciseDTO) => {
    return prisma.saved_exercises.create({
        data
    })
}

export const getSavedExerciseRepo = async (userId: string) => {
    return prisma.saved_exercises.findMany({
        where: {user_id: userId},
        include: {
            exercises: true // THIS MEANS TO JOIN EXERCISE DATA
        }
    });
}

export const updateSavedExerciseRepo = async (id: string, data: SaveExerciseDTO) => {
  return prisma.saved_exercises.update({
    where: { id },
    data: { ...data },
  })
}

export const deleteSavedExerciseRepo = async (id: string) => {
    return prisma.saved_exercises.delete({
        where: {id: id},
    });
};