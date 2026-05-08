import { prisma } from "../lib/prisma.js";
export const getRoutinesService = async (userId) => {
    return prisma.custom_routines.findMany({
        where: { user_id: userId },
        include: {
            exercises: true,
        },
    });
};
export const getRoutineService = async (userId, id) => {
    return prisma.custom_routines.findMany({
        where: { user_id: userId, id },
        include: {
            exercises: true,
        },
    });
};
export const createRoutineService = async (data) => {
    const { userId, name, exerciseIds } = data;
    const routineEntries = exerciseIds.map((exerciseId) => ({
        user_id: userId,
        exercise_id: exerciseId,
        notes: name,
    }));
    await prisma.custom_routines.createMany({
        data: routineEntries,
    });
    return {
        success: true,
        message: `Created routine "${name}" with ${exerciseIds.length} exercises`
    };
};
export const deleteRoutineService = async (id) => {
    return prisma.custom_routines.delete({
        where: { id: id },
    });
};
