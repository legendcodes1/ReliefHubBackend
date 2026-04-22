import type excersiseType from "../dto/excersiseType.js";
import { createExercise, deleteExercise, getExercise, updateExercise } from "../service/exerciseService.js";
import { Request, Response } from "express";


export const getExerciseController = async(req: Request, res: Response) => {
    try {
        const getExercises = await getExercise();
        return res.status(201).json(getExercises);
    } catch (error) {
        return res.status(500)
    }
}

export const createExerciseController = async(req: Request, res: Response) => {
    try {
        const createdExercise = await createExercise(req.body);
        return res.status(201).json(createdExercise );
    } catch (error) {
        return res.status(500)
    }
}


export const updateExerciseController = async(req: Request, res: Response) => {
    try {
        const {id} = req.body.id
        const updatedExercise = await updateExercise(id, req.body);
        return res.status(201).json(updatedExercise);
    } catch (error) {
        return res.status(500)
    }
}

export const deleteExerciseController = async(req: Request<{id: string}>, res: Response) => {
    try {
        const deletedExercise = await deleteExercise(req.params.id);
        return res.status(201).json(deletedExercise );
    } catch (error) {
        return res.status(500)
    }
}

