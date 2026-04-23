import { CreateExerciseDto, UpdateExerciseDto } from "../dto/excersiseType.js";
import { getExerciseRepo, createExerciseRepo, updateExerciseRepo, deleteExerciseRepo } from "../repositories/excerciseRepo.js";

export class ExerciseServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const validateDurationMinutes = (durationMinutes: unknown) => {
  if (durationMinutes === undefined || durationMinutes === null) {
    return;
  }

  if (typeof durationMinutes !== "number" || !Number.isInteger(durationMinutes) || durationMinutes < 0) {
    throw new ExerciseServiceError("duration_minutes must be a non-negative integer or null", 400);
  }
};

const validateCreatePayload = (data: CreateExerciseDto) => {
  if (!data.title?.trim()) throw new ExerciseServiceError("title is required", 400);
  if (!data.body_part_id?.trim()) throw new ExerciseServiceError("body_part_id is required", 400);
  if (!data.discomfort_type_id?.trim()) throw new ExerciseServiceError("discomfort_type_id is required", 400);
  if (!data.description?.trim()) throw new ExerciseServiceError("description is required", 400);

  validateDurationMinutes(data.duration_minutes);
};

const validateUpdatePayload = (data: UpdateExerciseDto) => {
  if (Object.keys(data).length === 0) {
    throw new ExerciseServiceError("Request body cannot be empty", 400);
  }

  validateDurationMinutes(data.duration_minutes);
};

export const getExercise = async () => {
  return getExerciseRepo();
}

export const createExercise = async (data: CreateExerciseDto) => {
  validateCreatePayload(data);
  return createExerciseRepo(data);
}

export const updateExercise = async(id: string, data: UpdateExerciseDto) => {
  if (!id?.trim()) {
    throw new ExerciseServiceError("id is required", 400);
  }

  validateUpdatePayload(data);
  return updateExerciseRepo(id, data);
}

export const deleteExercise = async(id: string) => {
  if (!id?.trim()) {
    throw new ExerciseServiceError("id is required", 400);
  }

  return deleteExerciseRepo(id);
}
