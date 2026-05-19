import { prisma } from "../lib/prisma.js";
export class ExerciseServiceError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
const validateDurationMinutes = (durationMinutes) => {
    if (durationMinutes === undefined || durationMinutes === null) {
        return;
    }
    if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes < 0) {
        throw new ExerciseServiceError("duration_minutes must be a non-negative integer or null", 400);
    }
};
const validateCreatePayload = (data) => {
    if (!data.title?.trim())
        throw new ExerciseServiceError("title is required", 400);
    if (!data.body_part_id?.trim())
        throw new ExerciseServiceError("body_part_id is required", 400);
    if (!data.discomfort_type_id?.trim())
        throw new ExerciseServiceError("discomfort_type_id is required", 400);
    if (!data.description?.trim())
        throw new ExerciseServiceError("description is required", 400);
    validateDurationMinutes(data.duration_minutes);
};
const validateUpdatePayload = (data) => {
    if (Object.keys(data).length === 0) {
        throw new ExerciseServiceError("Request body cannot be empty", 400);
    }
    validateDurationMinutes(data.duration_minutes);
};
export const getExercise = async () => {
    const exercises = await prisma.exercises.findMany({
        include: {
            body_parts: {
                select: { name: true }
            }
        }
    });
    return exercises.map((ex) => ({
        ...ex,
        body_part_name: ex.body_parts.name
    }));
};
export const getExerciseById = async (id) => {
    if (!id?.trim()) {
        throw new ExerciseServiceError("id is required", 400);
    }
    const exercise = await prisma.exercises.findUnique({
        where: { id },
    });
    if (!exercise) {
        throw new ExerciseServiceError("Exercise not found", 404);
    }
    return exercise;
};
export const createExercise = async (data) => {
    validateCreatePayload(data);
    return prisma.exercises.create({
        data: {
            ...data,
        },
    });
};
export const updateExercise = async (id, data) => {
    if (!id?.trim()) {
        throw new ExerciseServiceError("id is required", 400);
    }
    validateUpdatePayload(data);
    return prisma.exercises.update({
        where: { id },
        data: { ...data },
    });
};
export const deleteExercise = async (id) => {
    if (!id?.trim()) {
        throw new ExerciseServiceError("id is required", 400);
    }
    return prisma.exercises.delete({
        where: { id },
    });
};
