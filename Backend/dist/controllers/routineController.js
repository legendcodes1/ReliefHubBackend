import { getRoutinesService, createRoutineService, deleteRoutineService } from "../service/routineService.js";
export const getRoutinesController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const routines = await getRoutinesService(userId);
        return res.status(200).json(routines);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get routines" });
    }
};
export const createRoutineController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const { name, exercise_ids } = req.body;
        if (!name || !exercise_ids || !Array.isArray(exercise_ids)) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        const result = await createRoutineService({
            userId,
            name,
            exerciseIds: exercise_ids,
        });
        return res.status(201).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create routine" });
    }
};
export const deleteRoutineController = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await deleteRoutineService(id);
        return res.status(200).json(result);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete routine" });
    }
};
