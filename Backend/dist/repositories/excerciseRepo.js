import { prisma } from "../lib/prisma.js";
export const getExerciseRepo = async () => {
    return prisma.exercises.findMany();
};
export const createExerciseRepo = async (data) => {
    return prisma.exercises.create({
        data: {
            ...data,
        },
    });
};
export const updateExerciseRepo = async (id, data) => {
    return prisma.exercises.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteExerciseRepo = async (id) => {
    return prisma.exercises.delete({
        where: { id },
    });
};
