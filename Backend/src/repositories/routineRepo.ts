import { prisma } from "../lib/prisma.js"


export const createRoutineCompletionsRepo = async (data: { user_id: string; exercise_id: string; notes: string }) => {
    return prisma.custom_routines.create({
        data
    })
}

export const getRoutineCompletionsRepo = async (userId: string) => {
    return prisma.custom_routines.findMany({
        where: {user_id: userId},
        include: {
            exercises: true
        }
    });
}

export const updateRoutineCompletionsRepo = async (id: string, data: { notes: string }) => {
  return prisma.custom_routines.update({
    where: { id },
    data: { ...data },
  })
}

export const deleteSavedExerciseRepo = async (id: string) => {
    return prisma.custom_routines.delete({
        where: {id: id},
    });
};