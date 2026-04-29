import { prisma } from "../lib/prisma.js";
export const createRoutineCompletionsRepo = async (data) => {
    return prisma.routine_completions.create({
        data
    });
};
export const getRoutineCompletionsRepo = async (userId) => {
    return prisma.routine_completions.findMany({
        where: { user_id: userId },
        include: {
            exercises: true // THIS MEANS TO JOIN EXERCISE DATA
        }
    });
};
export const updateRoutineCompletionsRepo = async (id, data) => {
    return prisma.routine_completions.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteSavedExerciseRepo = async (id) => {
    return prisma.routine_completions.delete({
        where: { id: id },
    });
};
