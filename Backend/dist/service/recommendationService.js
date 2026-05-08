import { prisma } from "../lib/prisma.js";
export const findRecommendedExercise = async (data) => {
    const { bodyPartId, discomfortTypeId, difficultyLevel, maxDuration } = data;
    return await prisma.exercises.findMany({
        where: {
            body_part_id: bodyPartId,
            discomfort_type_id: discomfortTypeId,
            ...(difficultyLevel && {
                difficulty_level: difficultyLevel,
            }),
            ...(maxDuration && {
                duration_minutes: {
                    lte: maxDuration,
                },
            }),
        },
        take: 5,
    });
};
