import { createDiscomfortService, getDiscomfortService, updateDiscomfortService, deleteDiscomfortService } from "../service/discomfortService.js";
export const getDiscomfortController = async (req, res) => {
    try {
        const discomfortData = await getDiscomfortService();
        return res.status(201).json(discomfortData);
    }
    catch (error) {
        return res.status(500).json({ message: "no data found" });
    }
};
export const createDiscomfortController = async (req, res) => {
    try {
        const data = req.body;
        const createDiscomfortData = await createDiscomfortService(data);
        return res.status(201).json(createDiscomfortData);
    }
    catch (error) {
        return res.status(500).json({ message: "no data found" });
    }
};
export const updateDiscomfortController = async (req, res) => {
    try {
        const data = req.body;
        const createDiscomfortData = await updateDiscomfortService(req.params.id, data);
        return res.status(201).json(createDiscomfortData);
    }
    catch (error) {
        return res.status(500).json({ message: "no data found" });
    }
};
export const deleteDiscomfortController = async (req, res) => {
    try {
        const deleteDiscomfortData = await deleteDiscomfortService(req.params.id);
        return res.status(201).json(deleteDiscomfortData);
    }
    catch (error) {
        return res.status(500).json({ message: "no data found" });
    }
};
