import { routineType } from "../dto/routineType.js"
import { getRoutineCompletionsRepo, createRoutineCompletionsRepo, updateRoutineCompletionsRepo, deleteSavedExerciseRepo  } from "../repositories/routineRepo.js"

export const getRoutineService = async(userId: string) =>{
    return await getRoutineCompletionsRepo(userId)
}

export const createRoutineService = async(data: routineType) =>{
    return createRoutineCompletionsRepo(data)
}

export const updateRoutineService = async(id: string, data: routineType) =>{
    return updateRoutineCompletionsRepo(id, data)
}

export const deleteRoutineService = async(id: string) =>{
    return deleteSavedExerciseRepo(id)
}