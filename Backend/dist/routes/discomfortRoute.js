import { Router } from "express";
import { createDiscomfortController, deleteDiscomfortController, getDiscomfortController, updateDiscomfortController } from "../controllers/discomfortController.js";
const discomfortRouter = Router();
discomfortRouter.get("/", getDiscomfortController);
discomfortRouter.post("/", createDiscomfortController);
discomfortRouter.put("/:id", updateDiscomfortController);
discomfortRouter.delete("/:id", deleteDiscomfortController);
export default discomfortRouter;
