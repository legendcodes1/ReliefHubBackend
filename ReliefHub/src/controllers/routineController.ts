import { Request, Response } from "express";
import { routineType } from "../dto/routineType.js";
import { getRoutineService, createRoutineService, updateRoutineService, deleteRoutineService } from "../service/routineService.js";

export const getRoutineController = async(req: Request<{id:string }>, res:Response) => {

    try {
        const {id} = req.params
        const routineData = await getRoutineService(id)
        return routineData
    } catch (error) {
        return res.status(201).json({messgae: "no data found"})
    }
}

export const createRoutineController = async(req: Request, res:Response) => {
    try {
        const data = req.body
        const createRoutineData = await createRoutineService(data)
        return createRoutineData;
    } catch (error) {
        return res.status(201).json({messgae: "no data found"})
    }
}

export const updateRoutineController = async(req: Request<{id:string }>, res:Response, data: routineType) => {
    try {
        const updatedRoutineData = await updateRoutineService(req.params.id, data)
        return updatedRoutineData;
    } catch (error) {
        return res.status(201).json({messgae: "no data found"})
    }
}

export const deleteRoutineController = async(req: Request<{id:string }>, res:Response) => {
    try {
        const deleteRoutineData = await deleteRoutineService(req.params.id)
        return deleteRoutineData;
    } catch (error) {
        return res.status(201).json({messgae: "no data found"})
    }
}