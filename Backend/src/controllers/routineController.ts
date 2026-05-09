import { Request, Response } from "express";
import { getRoutinesService, createRoutineService, deleteRoutineService, RoutineServiceError } from "../service/routineService.js";

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

export const createRoutineController = async(req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const { name, exercise_ids } = req.body;

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
