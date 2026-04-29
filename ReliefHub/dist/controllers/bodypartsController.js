import { createBodyPart, getAllBodyPart, } from "../repositories/bodypartsRepo.js";
export const getBodyPartController = async (req, res) => {
    try {
        const getBodyPart = await getAllBodyPart();
        return res.status(201).json(getBodyPart);
    }
    catch (error) {
        return res.status(500);
    }
};
export const createBodyPartController = async (req, res) => {
    try {
        const createBodyParts = await createBodyPart(req.body);
        return res.status(201).json(createBodyParts);
    }
    catch (error) {
        res.status(500);
    }
};
