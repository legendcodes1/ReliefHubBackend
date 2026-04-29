import { prisma } from "../lib/prisma.js";
export const createSavedExerciesRepo = async (data) => {
    return prisma.saved_exercises.create({
        data
    });
};
export const getSavedExerciseRepo = async (userId) => {
    return prisma.saved_exercises.findMany({
        where: { user_id: userId },
        include: {
            exercises: true // THIS MEANS TO JOIN EXERCISE DATA
        }
    });
};
export const updateSavedExerciseRepo = async (id, data) => {
    return prisma.saved_exercises.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteSavedExerciseRepo = async (id) => {
    return prisma.saved_exercises.delete({
        where: { id: id },
    });
};
