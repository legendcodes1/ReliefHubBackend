import { Request, Response } from "express";
import { getRoutinesService, createRoutineService, deleteRoutineService, updateRoutineService, getPublicRoutinesService, RoutineServiceError } from "../service/routineService.js";

function handleRoutineError(error: unknown, res: Response, fallbackMessage: string) {
  if (error instanceof RoutineServiceError) {
    return res.status(error.status).json({ message: error.message });
  }

  console.error(error);
  return res.status(500).json({ message: fallbackMessage });
}

export const getRoutinesController = async(req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const routines = await getRoutinesService(userId);
        return res.status(200).json(routines);
    } catch (error) {
        return handleRoutineError(error, res, "Failed to get routines");
    }
}

export const getPublicRoutinesController = async(_req: Request, res: Response) => {
    try {
        const routines = await getPublicRoutinesService();
        return res.status(200).json(routines);
    } catch (error) {
        return handleRoutineError(error, res, "Failed to get public routines");
    }
}

export const createRoutineController = async(req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, exercise_ids, is_public } = req.body as {
            name: unknown;
            exercise_ids: unknown;
            is_public?: unknown;
        };
        const isPublic = typeof is_public === "boolean" ? is_public : false;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Routine name is required" });
        }

        if (!Array.isArray(exercise_ids) || exercise_ids.length === 0) {
            return res.status(400).json({ message: "At least one exercise is required" });
        }

        if (!exercise_ids.every((exerciseId) => typeof exerciseId === "string" && exerciseId.trim())) {
            return res.status(400).json({ message: "exercise_ids must contain valid exercise IDs" });
        }

        if (new Set(exercise_ids).size !== exercise_ids.length) {
            return res.status(400).json({ message: "Duplicate exercise IDs are not allowed" });
        }

        const result = await createRoutineService({
            userId,
            name,
            exerciseIds: exercise_ids,
            isPublic,
        });

        return res.status(201).json(result);
    } catch (error) {
        return handleRoutineError(error, res, "Failed to create routine");
    }
}

export const deleteRoutineController = async(req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const result = await deleteRoutineService(userId, id);
        return res.status(200).json(result);
    } catch (error) {
        return handleRoutineError(error, res, "Failed to delete routine");
    }
}

export const updateRoutineController = async(req: Request<{ id: string }>, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { id } = req.params;
        const body = req.body as { name: unknown; exercise_ids: unknown; is_public?: unknown }
        const name = typeof body.name === 'string' ? body.name : ''
        const exercise_ids = Array.isArray(body.exercise_ids) ? body.exercise_ids : []
        const isPublic = typeof body.is_public === 'boolean' ? body.is_public : undefined

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Routine name is required" });
        }

        if (!Array.isArray(exercise_ids)) {
            return res.status(400).json({ message: "exercise_ids must be an array" });
        }

        if (!exercise_ids.every((exerciseId) => typeof exerciseId === "string" && exerciseId.trim())) {
            return res.status(400).json({ message: "exercise_ids must contain valid exercise IDs" });
        }

        if (new Set(exercise_ids).size !== exercise_ids.length) {
            return res.status(400).json({ message: "Duplicate exercise IDs are not allowed" });
        }

        const result = await updateRoutineService({
            userId,
            routineId: id,
            name,
            exerciseIds: exercise_ids,
            isPublic,
        });

        return res.status(200).json(result);
    } catch (error) {
        return handleRoutineError(error, res, "Failed to update routine");
    }
}