import { prisma } from "../lib/prisma.js";
export const getRoutineCompleteRepo = async () => {
    return prisma.routine_completions.findMany();
};
export const createDiscomfortTypeRepo = async (data) => {
    return prisma.discomfort_types.create({
        data: {
            ...data,
        },
    });
};
export const updateDiscomfortTypeRepo = async (id, data) => {
    return prisma.discomfort_types.update({
        where: { id },
        data: { ...data }
    });
};
export const deleteDiscomfortTypeRepo = async (id) => {
    return prisma.discomfort_types.delete({
        where: { id }
    });
};
