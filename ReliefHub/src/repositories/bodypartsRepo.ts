import bodypartsType from "../dto/bodypartsType.js"
import { prisma } from "../lib/prisma.js"

export const createBodyPart = async (data: bodypartsType) => {
    return prisma.body_parts.create({
        data: {
            ...data
        }
    })
}

export const getAllBodyPart = async () => {
    return prisma.body_parts.findMany();
}