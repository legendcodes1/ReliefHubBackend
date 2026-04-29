import { Prisma } from "../../generated/prisma/client.js";
import { createExercise, deleteExercise, ExerciseServiceError, getExercise, updateExercise } from "../service/exerciseService.js";
import { findRecommendedExercise } from "../service/recommendationService.js";
const handleExerciseError = (error, res) => {
    if (error instanceof ExerciseServiceError) {
        return res.status(error.statusCode).json({ error: error.message });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Exercise not found" });
        }
        if (error.code === "P2003") {
            return res.status(400).json({ error: "Invalid reference id for body part or discomfort type" });
        }
    }
    return res.status(500).json({ error: "Internal server error" });
};
export const getExerciseController = async (req, res) => {
    try {
        const exercises = await getExercise();
        return res.status(200).json(exercises);
    }
    catch (error) {
        return handleExerciseError(error, res);
    }
};
export const createExerciseController = async (req, res) => {
    try {
        const createdExercise = await createExercise(req.body);
        return res.status(201).json(createdExercise);
    }
    catch (error) {
        return handleExerciseError(error, res);
    }
};
export const updateExerciseController = async (req, res) => {
    try {
        const updatedExercise = await updateExercise(req.params.id, req.body);
        return res.status(200).json(updatedExercise);
    }
    catch (error) {
        return handleExerciseError(error, res);
    }
};
export const deleteExerciseController = async (req, res) => {
    try {
        const deletedExercise = await deleteExercise(req.params.id);
        return res.status(200).json(deletedExercise);
    }
    catch (error) {
        return handleExerciseError(error, res);
    }
};
export const getRecommendedExercises = async (req, res) => {
    try {
        const { bodyPartId, discomfortTypeId, difficultyLevel, maxDuration } = req.query;
        if (!bodyPartId || !discomfortTypeId) {
            return res.status(400).json({
                error: "bodyPartId and discomfortTypeId are required",
            });
        }
        const exercises = await findRecommendedExercise({
            bodyPartId: String(bodyPartId),
            discomfortTypeId: String(discomfortTypeId),
            difficultyLevel: difficultyLevel ? String(difficultyLevel) : undefined,
            maxDuration: maxDuration ? Number(maxDuration) : undefined,
        });
        return res.status(200).json(exercises);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Failed to get recommended exercises",
        });
    }
};
