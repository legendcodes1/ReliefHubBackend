import { prisma } from "../lib/prisma.js";

interface CreateRoutineInput {
  userId: string;
  name: string;
  exerciseIds: string[];
}

export const getRoutinesService = async (authUserId: string) => {
  const publicUser = await prisma.public_users.findFirst({
    where: { auth_id: authUserId },
  });

  if (!publicUser) {
    return [];
  }

  return prisma.custom_routines.findMany({
    where: { user_id: publicUser.id },
    include: {
      exercises: true,
    },
  });
};

export const getRoutineService = async (authUserId: string, id: string) => {
  const publicUser = await prisma.public_users.findFirst({
    where: { auth_id: authUserId },
  });

  if (!publicUser) {
    return [];
  }

  return prisma.custom_routines.findMany({
    where: { user_id: publicUser.id, id },
    include: {
      exercises: true,
    },
  });
};

export const createRoutineService = async (data: CreateRoutineInput) => {
  const { userId, name, exerciseIds } = data;

  const publicUser = await prisma.public_users.findFirst({
    where: { auth_id: userId },
  });

  if (!publicUser) {
    throw new Error("User not found in public_users table");
  }

  const routineEntries = exerciseIds.map((exerciseId) => ({
    user_id: publicUser.id,
    exercise_id: exerciseId,
    notes: name,
  }));

  await prisma.custom_routines.createMany({
    data: routineEntries,
  });

  return { 
    success: true, 
    message: `Created routine "${name}" with ${exerciseIds.length} exercises` 
  };
};

export const deleteRoutineService = async (authUserId: string, routineId: string) => {
  const publicUser = await prisma.public_users.findFirst({
    where: { auth_id: authUserId },
  });

  if (!publicUser) {
    throw new Error("User not found");
  }

  return prisma.custom_routines.delete({
    where: { id: routineId, user_id: publicUser.id },
  });
};
