import { prisma } from "../lib/prisma.js";
import { createRoutineFavorite, deleteRoutineFavorite, findRoutineFavorite, findUserFavoritesForRoutines, getFavoriteRoutinesByUser, countFavoritesForRoutines, } from "../repositories/routineFavoriteRepo.js";
export class RoutineFavoriteServiceError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}
async function ensurePublicRoutine(routineId) {
    return prisma.routines.findFirst({
        where: {
            id: routineId,
            is_public: true,
        },
        select: {
            id: true,
        },
    });
}
export const setRoutineFavorite = async (userId, routineId) => {
    if (!userId?.trim())
        throw new RoutineFavoriteServiceError("user_id is required", 400);
    if (!routineId?.trim())
        throw new RoutineFavoriteServiceError("routine_id is required", 400);
    const routine = await ensurePublicRoutine(routineId);
    if (!routine)
        throw new RoutineFavoriteServiceError("Public routine not found", 404);
    const existing = await findRoutineFavorite(userId, routineId);
    if (!existing) {
        await createRoutineFavorite(userId, routineId);
    }
    return getRoutineFavoriteStatus(userId, routineId);
};
export const removeRoutineFavorite = async (userId, routineId) => {
    if (!userId?.trim())
        throw new RoutineFavoriteServiceError("user_id is required", 400);
    if (!routineId?.trim())
        throw new RoutineFavoriteServiceError("routine_id is required", 400);
    const existing = await findRoutineFavorite(userId, routineId);
    if (existing) {
        await deleteRoutineFavorite(userId, routineId);
    }
    return getRoutineFavoriteStatus(userId, routineId);
};
export const getRoutineFavoriteStatus = async (userId, routineId) => {
    const [counts, userFavorites] = await Promise.all([
        countFavoritesForRoutines([routineId]),
        findUserFavoritesForRoutines(userId, [routineId]),
    ]);
    return {
        isFavorited: userFavorites[routineId] ?? false,
        count: counts[routineId] ?? 0,
    };
};
export const getBatchRoutineFavoriteStatus = async (userId, routineIds) => {
    if (!userId?.trim())
        throw new RoutineFavoriteServiceError("user_id is required", 400);
    if (!routineIds.length)
        return {};
    const [counts, userFavorites] = await Promise.all([
        countFavoritesForRoutines(routineIds),
        findUserFavoritesForRoutines(userId, routineIds),
    ]);
    const result = {};
    for (const id of routineIds) {
        result[id] = {
            isFavorited: userFavorites[id] ?? false,
            count: counts[id] ?? 0,
        };
    }
    return result;
};
export const getFavoriteRoutines = async (userId) => {
    if (!userId?.trim())
        throw new RoutineFavoriteServiceError("user_id is required", 400);
    return getFavoriteRoutinesByUser(userId);
};
