import { Router } from "express";

import { createBodyPartController, getBodyPartController } from "../controllers/bodypartsController.js";

const bodyPartRouter = Router();

bodyPartRouter.get("/", getBodyPartController);
bodyPartRouter.post("/", createBodyPartController);

export default bodyPartRouter;
