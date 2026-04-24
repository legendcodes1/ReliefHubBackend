import { routineType } from "../dto/routineType.js";
import { prisma } from "../lib/prisma.js"


export const createRoutineCompletionsRepo = async (data: routineType) => {
    return prisma.routine_completions.create({
        data
    })
}

export const getRoutineCompletionsRepo = async (userId: string) => {
    return prisma.routine_completions.findMany({
        where: {user_id: userId},
        include: {
            exercises: true // THIS MEANS TO JOIN EXERCISE DATA
        }
    });
}

export const updateRoutineCompletionsRepo = async (id: string, data: routineType) => {
  return prisma.routine_completions.update({
    where: { id },
    data: { ...data },
  })
}

export const deleteSavedExerciseRepo = async (id: string) => {
    return prisma.routine_completions.delete({
        where: {id: id},
    });
};