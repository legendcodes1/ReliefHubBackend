import { Router } from "express";
import { getExerciseController, createExerciseController, deleteExerciseController, updateExerciseController } from "../controllers/excersiseController.js";

const exerciseRouter = Router();

exerciseRouter.get("/", getExerciseController)
exerciseRouter.post("/", createExerciseController)
exerciseRouter.put("/:id", updateExerciseController)
exerciseRouter.delete("/:id", deleteExerciseController)

export default exerciseRouter