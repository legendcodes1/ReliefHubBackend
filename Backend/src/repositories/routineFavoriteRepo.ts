import { prisma } from "../lib/prisma.js";

export const findRoutineFavorite = async (userId: string, routineId: string) => {
  return prisma.routine_favorites.findUnique({
    where: {
      user_id_routine_id: {
        user_id: userId,
        routine_id: routineId,
      },
    },
  });
};

export const createRoutineFavorite = async (userId: string, routineId: string) => {
  return prisma.routine_favorites.create({
    data: {
      user_id: userId,
      routine_id: routineId,
    },
  });
};

export const deleteRoutineFavorite = async (userId: string, routineId: string) => {
  return prisma.routine_favorites.delete({
    where: {
      user_id_routine_id: {
        user_id: userId,
        routine_id: routineId,
      },
    },
  });
};

export const getFavoriteRoutinesByUser = async (userId: string) => {
  return prisma.routine_favorites.findMany({
    where: {
      user_id: userId,
      routines: {
        is_public: true,
      },
    },
    include: {
      routines: {
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
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });
};

export const countFavoritesForRoutines = async (routineIds: string[]) => {
  const results = await prisma.routine_favorites.groupBy({
    by: ["routine_id"],
    where: {
      routine_id: {
        in: routineIds,
      },
      routines: {
        is_public: true,
      },
    },
    _count: {
      routine_id: true,
    },
  });

  const counts: Record<string, number> = {};
  for (const id of routineIds) {
    counts[id] = 0;
  }

  for (const row of results) {
    counts[row.routine_id] = row._count.routine_id;
  }

  return counts;
};

export const findUserFavoritesForRoutines = async (userId: string, routineIds: string[]) => {
  const favorites = await prisma.routine_favorites.findMany({
    where: {
      user_id: userId,
      routine_id: {
        in: routineIds,
      },
      routines: {
        is_public: true,
      },
    },
    select: {
      routine_id: true,
    },
  });

  const result: Record<string, boolean> = {};
  for (const favorite of favorites) {
    result[favorite.routine_id] = true;
  }

  return result;
};
