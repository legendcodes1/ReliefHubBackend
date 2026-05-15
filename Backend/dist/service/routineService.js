import { prisma } from "../lib/prisma.js";
export class RoutineServiceError extends Error {
    status;
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
async function getPublicUserByAuthId(authUserId) {
    return prisma.public_users.findFirst({
        where: { auth_id: authUserId },
    });
}
export const getRoutinesService = async (authUserId) => {
    const publicUser = await getPublicUserByAuthId(authUserId);
    if (!publicUser) {
        return [];
    }
    return prisma.routines.findMany({
        where: { user_id: publicUser.id },
        include: {
            routine_exercises: {
                include: {
                    exercises: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });
};
export const getRoutineService = async (authUserId, id) => {
    const publicUser = await getPublicUserByAuthId(authUserId);
    if (!publicUser) {
        return null;
    }
    return prisma.routines.findFirst({
        where: { user_id: publicUser.id, id },
        include: {
            routine_exercises: {
                include: {
                    exercises: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });
};
export const getPublicRoutinesService = async () => {
    return prisma.routines.findMany({
        where: {
            is_public: true,
        },
        include: {
            users: {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
            routine_exercises: {
                include: {
                    exercises: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
        orderBy: {
            created_at: "desc",
        },
    });
};
export const createRoutineService = async (data) => {
    const { userId, name, exerciseIds, isPublic } = data;
    const publicUser = await getPublicUserByAuthId(userId);
    if (!publicUser) {
        throw new RoutineServiceError("User not found", 404);
    }
    const duplicateIds = new Set();
    const seen = new Set();
    for (const exerciseId of exerciseIds) {
        if (seen.has(exerciseId)) {
            duplicateIds.add(exerciseId);
        }
        seen.add(exerciseId);
    }
    if (duplicateIds.size > 0) {
        throw new RoutineServiceError("Duplicate exercise IDs are not allowed in a routine", 400);
    }
    const createdRoutine = await prisma.$transaction(async (tx) => {
        const routine = await tx.routines.create({
            data: {
                user_id: publicUser.id,
                name: name.trim(),
                is_public: isPublic ?? false,
            },
        });
        await tx.routine_exercises.createMany({
            data: exerciseIds.map((exerciseId, index) => ({
                routine_id: routine.id,
                exercise_id: exerciseId,
                position: index + 1,
            })),
        });
        return tx.routines.findUnique({
            where: { id: routine.id },
            include: {
                routine_exercises: {
                    include: {
                        exercises: true,
                    },
                    orderBy: {
                        position: "asc",
                    },
                },
            },
        });
    });
    if (!createdRoutine) {
        throw new RoutineServiceError("Failed to create routine", 500);
    }
    return createdRoutine;
};
export const deleteRoutineService = async (authUserId, routineId) => {
    const publicUser = await getPublicUserByAuthId(authUserId);
    if (!publicUser) {
        throw new RoutineServiceError("User not found", 404);
    }
    const existingRoutine = await prisma.routines.findFirst({
        where: {
            id: routineId,
            user_id: publicUser.id,
        },
    });
    if (!existingRoutine) {
        throw new RoutineServiceError("Routine not found", 404);
    }
    return prisma.routines.delete({
        where: { id: existingRoutine.id },
    });
};
export const updateRoutineService = async (data) => {
    const { userId, routineId, name, exerciseIds, isPublic } = data;
    const publicUser = await getPublicUserByAuthId(userId);
    if (!publicUser) {
        throw new RoutineServiceError("User not found", 404);
    }
    const existingRoutine = await prisma.routines.findFirst({
        where: {
            id: routineId,
            user_id: publicUser.id,
        },
    });
    if (!existingRoutine) {
        throw new RoutineServiceError("Routine not found", 404);
    }
    const duplicateIds = new Set();
    const seen = new Set();
    for (const exerciseId of exerciseIds) {
        if (seen.has(exerciseId)) {
            duplicateIds.add(exerciseId);
        }
        seen.add(exerciseId);
    }
    if (duplicateIds.size > 0) {
        throw new RoutineServiceError("Duplicate exercise IDs are not allowed in a routine", 400);
    }
    await prisma.$transaction(async (tx) => {
        await tx.routines.update({
            where: { id: existingRoutine.id },
            data: {
                name: name.trim(),
                ...(typeof isPublic === "boolean" ? { is_public: isPublic } : {}),
            },
        });
        await tx.routine_exercises.deleteMany({
            where: { routine_id: existingRoutine.id },
        });
        if (exerciseIds.length > 0) {
            await tx.routine_exercises.createMany({
                data: exerciseIds.map((exerciseId, index) => ({
                    routine_id: existingRoutine.id,
                    exercise_id: exerciseId,
                    position: index + 1,
                })),
            });
        }
    });
    return prisma.routines.findUnique({
        where: { id: existingRoutine.id },
        include: {
            routine_exercises: {
                include: {
                    exercises: true,
                },
                orderBy: {
                    position: "asc",
                },
            },
        },
    });
};
