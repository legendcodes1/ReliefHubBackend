import { createBodyPart, getAllBodyPart, } from "../repositories/bodypartsRepo.js";
export const getBodyPartController = async (req, res) => {
    try {
        const getBodyPart = await getAllBodyPart();
        return res.status(200).json(getBodyPart);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to fetch body parts" });
    }
};
export const createBodyPartController = async (req, res) => {
    try {
        const createBodyParts = await createBodyPart(req.body);
        return res.status(201).json(createBodyParts);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to create body part" });
    }
};
