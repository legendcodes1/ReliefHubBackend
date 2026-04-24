import { Request, Response } from "express";
import { createSavedExerciesRepo, deleteSavedExerciseRepo, getSavedExerciseRepo, updateSavedExerciseRepo } from "../repositories/savedExerciseRepo.js";

export const getSavedExerciseController = async(req: Request<{id: string}>, res: Response) => {
    try {
        const userId = req.params.id;
        const savedExercise = await getSavedExerciseRepo(userId);
        return res.status(200).json(savedExercise);
    } catch (error) {
        return res.status(500).json("No saved exercise were found")
    }
}

export const createSavedExerciseController = async (req: Request, res: Response) => {
    try {
        const createSavedExercise = await createSavedExerciesRepo(req.body)
        return res.status(200).json(createSavedExercise)
    } catch (error) {
        return res.status(500).json("Unable to save exercies")
    }
}

export const updateSavedExerciseController = async(req: Request<{id: string}>, res: Response) => {
  try {
    const updateSavedExercise = await updateSavedExerciseRepo(req.params.id, req.body);
    return res.status(200).json(updateSavedExercise);
  } catch (error) {
    return res.status(500).json("Unable to update Saved Exercise");
  }
}

export const deleteSavedExerciseController = async(req: Request<{id: string}>, res: Response) => {
  try {
    const deletedSavedExercise = await deleteSavedExerciseRepo(req.params.id);
    return res.status(200).json(deletedSavedExercise);
  } catch (error) {
    return res.status(500).json("Unable to delete saved exercise ");
  }
}