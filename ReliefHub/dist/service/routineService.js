import { prisma } from "../lib/prisma.js";
export const getRoutineService = async (userId) => {
    return prisma.routine_completions.findMany({
        where: { user_id: userId },
        include: {
            exercises: true, // THIS MEANS TO JOIN EXERCISE DATA
        },
    });
};
export const createRoutineService = async (data) => {
    return prisma.routine_completions.create({
        data,
    });
};
export const updateRoutineService = async (id, data) => {
    return prisma.routine_completions.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteRoutineService = async (id) => {
    return prisma.routine_completions.delete({
        where: { id: id },
    });
};
