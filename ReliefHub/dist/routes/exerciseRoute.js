import { Router } from "express";
import { getExerciseController, createExerciseController, deleteExerciseController, updateExerciseController, getRecommendedExercises } from "../controllers/excersiseController.js";
const exerciseRouter = Router();
exerciseRouter.get("/recommendations", getRecommendedExercises);
exerciseRouter.get("/", getExerciseController);
exerciseRouter.post("/", createExerciseController);
exerciseRouter.put("/:id", updateExerciseController);
exerciseRouter.delete("/:id", deleteExerciseController);
export default exerciseRouter;
