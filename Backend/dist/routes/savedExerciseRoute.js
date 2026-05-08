import { Router } from "express";
import { createSavedExerciseController, deleteSavedExerciseController, getSavedExerciseController, } from "../controllers/savedExerciseController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
const savedExerciseRouter = Router();
savedExerciseRouter.get("/", requireAuth, getSavedExerciseController);
savedExerciseRouter.post("/", requireAuth, createSavedExerciseController);
savedExerciseRouter.delete("/:id", requireAuth, deleteSavedExerciseController);
export default savedExerciseRouter;
