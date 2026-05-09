import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getRoutinesController, createRoutineController, deleteRoutineController } from "../controllers/routineController.js";

const routineRouter = Router();

routineRouter.get("/", requireAuth, getRoutinesController);
routineRouter.post("/", requireAuth, createRoutineController);
routineRouter.delete("/:id", requireAuth, deleteRoutineController);

export default routineRouter;