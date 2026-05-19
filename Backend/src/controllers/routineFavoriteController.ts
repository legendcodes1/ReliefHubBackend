import { Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client.js";
import {
  getBatchRoutineFavoriteStatus,
  getFavoriteRoutines,
  removeRoutineFavorite,
  RoutineFavoriteServiceError,
  setRoutineFavorite,
} from "../service/routineFavoriteService.js";

const handleFavoriteError = (error: unknown, res: Response) => {
  if (error instanceof RoutineFavoriteServiceError) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({ message: "Routine already favorited" });
    }
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Favorite not found" });
    }
  }

  console.error(error);
  return res.status(500).json({ message: "Internal server error" });
};

export const getFavoriteRoutinesController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await getFavoriteRoutines(userId);
    return res.status(200).json(result);
  } catch (error) {
    return handleFavoriteError(error, res);
  }
};

export const createRoutineFavoriteController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const routineId = req.body?.routine_id;
    if (typeof routineId !== "string" || !routineId.trim()) {
      return res.status(400).json({ message: "routine_id is required" });
    }

    const result = await setRoutineFavorite(userId, routineId);
    return res.status(200).json(result);
  } catch (error) {
    return handleFavoriteError(error, res);
  }
};

export const deleteRoutineFavoriteController = async (req: Request<{ routineId: string }>, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const routineId = req.params.routineId;
    if (typeof routineId !== "string" || !routineId.trim()) {
      return res.status(400).json({ message: "routineId route parameter is required" });
    }

    const result = await removeRoutineFavorite(userId, routineId);
    return res.status(200).json(result);
  } catch (error) {
    return handleFavoriteError(error, res);
  }
};

export const getRoutineFavoriteStatusController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const ids = req.query.ids;
    if (typeof ids !== "string") {
      return res.status(400).json({ message: "ids query parameter must be a comma-separated string" });
    }

    const routineIds = ids.split(",").map(id => id.trim()).filter(Boolean);
    if (!routineIds.length) {
      return res.status(400).json({ message: "ids must contain at least one routine ID" });
    }

    const result = await getBatchRoutineFavoriteStatus(userId, routineIds);
    return res.status(200).json(result);
  } catch (error) {
    return handleFavoriteError(error, res);
  }
};
