import { prisma } from "../lib/prisma.js";
export const getDiscomfortService = async () => {
    try {
        return prisma.discomfort_types.findMany();
    }
    catch (error) {
        throw error;
    }
};
export const createDiscomfortService = async (data) => {
    if (!data.name) {
        return "Name of discomfort is required";
    }
    return prisma.discomfort_types.create({
        data: {
            ...data,
        },
    });
};
export const updateDiscomfortService = async (id, data) => {
    if (!data.name || !id) {
        return "discomfort not found";
    }
    return prisma.discomfort_types.update({
        where: { id },
        data: { ...data }
    });
};
export const deleteDiscomfortService = async (id) => {
    if (!id) {
        return "discomfort not found";
    }
    return prisma.discomfort_types.delete({
        where: { id }
    });
};
