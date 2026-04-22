import excersiseType from "../dto/excersiseType.js";
import {prisma} from "../lib/prisma.js"
import { getExerciseRepo, createExerciseRepo, updateExerciseRepo, deleteExerciseRepo } from "../repositories/excerciseRepo.js";


export const getExercise = async () => {

    try {
        const exerciseData = await getExerciseRepo();
        return exerciseData;
    } catch (error) {
        return error
    }
    
}

export const createExercise = async (data: excersiseType) => {

    try {
        const createExerciseData = await createExerciseRepo(data);
        return createExerciseData;
    } catch (error) {
        return error
    }
    
}

export const updateExercise = async(id: string, data:excersiseType) => {
    try {
        const updateExerciseData = await updateExerciseRepo(id, data);
        return updateExerciseData ;
    } catch (error) {
        return error
    }
}

export const deleteExercise = async(id: string) => {
    try {
        // const deleteExerciseData = await deleteExerciseRepo(id);
        return deleteExerciseRepo(id) ;
    } catch (error) {
        return error
    }
}