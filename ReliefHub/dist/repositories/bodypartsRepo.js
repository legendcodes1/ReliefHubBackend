import { prisma } from "../lib/prisma.js";
export const createBodyPart = async (data) => {
    return prisma.body_parts.create({
        data: {
            ...data
        }
    });
};
export const getAllBodyPart = async () => {
    return prisma.body_parts.findMany();
};
