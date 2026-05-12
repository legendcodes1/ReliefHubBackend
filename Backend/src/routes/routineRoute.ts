import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getRoutinesController, createRoutineController, deleteRoutineController, updateRoutineController } from "../controllers/routineController.js";

const routineRouter = Router();

routineRouter.get("/", requireAuth, getRoutinesController);
routineRouter.post("/", requireAuth, createRoutineController);
routineRouter.put("/:id", requireAuth, updateRoutineController);
routineRouter.delete("/:id", requireAuth, deleteRoutineController);

export default routineRouter;