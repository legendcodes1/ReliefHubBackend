import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { createRoutineFavoriteController, deleteRoutineFavoriteController, getFavoriteRoutinesController, getRoutineFavoriteStatusController, } from "../controllers/routineFavoriteController.js";
const routineFavoriteRouter = Router();
routineFavoriteRouter.get("/status", requireAuth, getRoutineFavoriteStatusController);
routineFavoriteRouter.get("/", requireAuth, getFavoriteRoutinesController);
routineFavoriteRouter.post("/", requireAuth, createRoutineFavoriteController);
routineFavoriteRouter.delete("/:routineId", requireAuth, deleteRoutineFavoriteController);
export default routineFavoriteRouter;
