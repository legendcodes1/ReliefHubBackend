import { Request, Response } from "express";
import { createDiscomfortService, getDiscomfortService, updateDiscomfortService, deleteDiscomfortService } from "../service/discomfortService.js";


export const getDiscomfortController = async(req: Request, res:Response) => {
    try {
        const discomfortData = await getDiscomfortService()
        return res.status(201).json(discomfortData)
    } catch (error) {
        return res.status(500).json({message: "no data found"})
    }
}

export const createDiscomfortController = async(req: Request, res:Response) => {
    try {
        const data = req.body;
        const createDiscomfortData = await createDiscomfortService(data)
        return res.status(201).json(createDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "no data found"})
    }
}


export const updateDiscomfortController = async(req: Request<{id:string}>, res:Response) => {
    try {
        const data = req.body;

        const createDiscomfortData = await updateDiscomfortService(req.params.id, data)
        return res.status(201).json(createDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "no data found"})
    }
}

export const deleteDiscomfortController = async(req: Request<{id:string}>, res:Response) => {
    try {

        const deleteDiscomfortData = await deleteDiscomfortService(req.params.id)
        return res.status(201).json(deleteDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "no data found"})
    }
}