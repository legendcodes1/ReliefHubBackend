import { prisma } from "../lib/prisma.js";
export const createRoutineCompletionsRepo = async (data) => {
    return prisma.routines.create({
        data
    });
};
export const getRoutineCompletionsRepo = async (userId) => {
    return prisma.routines.findMany({
        where: { user_id: userId },
        include: {
            routine_exercises: true
        }
    });
};
export const updateRoutineCompletionsRepo = async (id, data) => {
    return prisma.routines.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteSavedExerciseRepo = async (id) => {
    return prisma.routines.delete({
        where: { id: id },
    });
};
