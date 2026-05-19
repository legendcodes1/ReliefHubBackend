import { prisma } from "../lib/prisma.js"


export const createRoutineCompletionsRepo = async (data: { user_id: string; name: string }) => {
    return prisma.routines.create({
        data
    })
}

export const getRoutineCompletionsRepo = async (userId: string) => {
    return prisma.routines.findMany({
        where: {user_id: userId},
        include: {
            routine_exercises: true
        }
    });
}

export const updateRoutineCompletionsRepo = async (id: string, data: { name: string }) => {
  return prisma.routines.update({
    where: { id },
    data: { ...data },
  })
}

export const deleteSavedExerciseRepo = async (id: string) => {
    return prisma.routines.delete({
        where: {id: id},
    });
};
