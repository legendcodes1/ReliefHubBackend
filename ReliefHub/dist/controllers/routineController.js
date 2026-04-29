import { getRoutineService, createRoutineService, updateRoutineService, deleteRoutineService } from "../service/routineService.js";
export const getRoutineController = async (req, res) => {
    try {
        const { id } = req.params;
        const routineData = await getRoutineService(id);
        return routineData;
    }
    catch (error) {
        return res.status(201).json({ messgae: "no data found" });
    }
};
export const createRoutineController = async (req, res) => {
    try {
        const data = req.body;
        const createRoutineData = await createRoutineService(data);
        return createRoutineData;
    }
    catch (error) {
        return res.status(201).json({ messgae: "no data found" });
    }
};
export const updateRoutineController = async (req, res, data) => {
    try {
        const updatedRoutineData = await updateRoutineService(req.params.id, data);
        return updatedRoutineData;
    }
    catch (error) {
        return res.status(201).json({ messgae: "no data found" });
    }
};
export const deleteRoutineController = async (req, res) => {
    try {
        const deleteRoutineData = await deleteRoutineService(req.params.id);
        return deleteRoutineData;
    }
    catch (error) {
        return res.status(201).json({ messgae: "no data found" });
    }
};
