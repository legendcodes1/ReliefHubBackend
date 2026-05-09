import { prisma } from "../lib/prisma.js";

interface CreateRoutineInput {
  userId: string;
  name: string;
  exerciseIds: string[];
}

export class RoutineServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getPublicUserByAuthId(authUserId: string) {
  return prisma.public_users.findFirst({
    where: { auth_id: authUserId },
  });
}

export const getRoutinesService = async (authUserId: string) => {
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

export const getRoutineService = async (authUserId: string, id: string) => {
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

export const createRoutineService = async (data: CreateRoutineInput) => {
  const { userId, name, exerciseIds } = data;

  const publicUser = await getPublicUserByAuthId(userId);

  if (!publicUser) {
    throw new RoutineServiceError("User not found", 404);
  }

  const duplicateIds = new Set<string>();
  const seen = new Set<string>();

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

export const deleteRoutineService = async (authUserId: string, routineId: string) => {
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
