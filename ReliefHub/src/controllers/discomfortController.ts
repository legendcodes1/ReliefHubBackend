import { Request, Response } from "express";
import { createDiscomfortService, getDiscomfortService, updateDiscomfortService, deleteDiscomfortService } from "../service/discomfortService.js";


export const getDiscomfortController = async(req: Request, res:Response) => {
    try {
        const discomfortData = await getDiscomfortService()
        return res.status(200).json(discomfortData)
    } catch (error) {
        return res.status(500).json({message: "Unable to fetch discomfort types"})
    }
}

export const createDiscomfortController = async(req: Request, res:Response) => {
    try {
        const data = req.body;
        const createDiscomfortData = await createDiscomfortService(data)
        if (typeof createDiscomfortData === "string") {
            return res.status(400).json({ message: createDiscomfortData })
        }
        return res.status(201).json(createDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "Unable to create discomfort type"})
    }
}


export const updateDiscomfortController = async(req: Request<{id:string}>, res:Response) => {
    try {
        const data = req.body;

        const createDiscomfortData = await updateDiscomfortService(req.params.id, data)
        if (typeof createDiscomfortData === "string") {
            return res.status(400).json({ message: createDiscomfortData })
        }
        return res.status(200).json(createDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "Unable to update discomfort type"})
    }
}

export const deleteDiscomfortController = async(req: Request<{id:string}>, res:Response) => {
    try {

        const deleteDiscomfortData = await deleteDiscomfortService(req.params.id)
        if (typeof deleteDiscomfortData === "string") {
            return res.status(400).json({ message: deleteDiscomfortData })
        }
        return res.status(200).json(deleteDiscomfortData)
    } catch (error) {
        return res.status(500).json({message: "Unable to delete discomfort type"})
    }
}
