import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getRoutinesController, getPublicRoutinesController, createRoutineController, deleteRoutineController, updateRoutineController } from "../controllers/routineController.js";

const routineRouter = Router();

routineRouter.get("/", requireAuth, getRoutinesController);
routineRouter.get("/public", requireAuth, getPublicRoutinesController);
routineRouter.post("/", requireAuth, createRoutineController);
routineRouter.put("/:id", requireAuth, updateRoutineController);
routineRouter.delete("/:id", requireAuth, deleteRoutineController);

export default routineRouter;
