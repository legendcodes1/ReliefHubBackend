import { Request, Response } from "express";
import { createSavedExerciesRepo, deleteSavedExerciseRepo, getSavedExerciseRepo, updateSavedExerciseRepo } from "../repositories/savedExerciseRepo.js";

export const getSavedExerciseController = async(req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }
        const userId = req.user.id;
        const savedExercise = await getSavedExerciseRepo(userId);
        return res.status(200).json(savedExercise);
    } catch (error) {
        return res.status(500).json({ message: "Unable to fetch saved exercises" })
    }
}

export const createSavedExerciseController = async (req: Request, res: Response) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }

        const exerciseId = req.body?.exercise_id;
        if (!exerciseId || typeof exerciseId !== "string") {
            return res.status(400).json({ message: "exercise_id is required" })
        }

        const createSavedExercise = await createSavedExerciesRepo({
            user_id: req.user.id,
            exercise_id: exerciseId,
        })

        return res.status(201).json(createSavedExercise)
    } catch (error) {
        return res.status(500).json({ message: "Unable to save exercise" })
    }
}

export const updateSavedExerciseController = async(req: Request<{id: string}>, res: Response) => {
  try {
    const updateSavedExercise = await updateSavedExerciseRepo(req.params.id, req.body);
    return res.status(200).json(updateSavedExercise);
  } catch (error) {
    return res.status(500).json({ message: "Unable to update saved exercise" });
  }
}

export const deleteSavedExerciseController = async(req: Request<{id: string}>, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const deletedSavedExercise = await deleteSavedExerciseRepo(req.params.id);
    return res.status(200).json(deletedSavedExercise);
  } catch (error) {
    return res.status(500).json({ message: "Unable to delete saved exercise" });
  }
}
