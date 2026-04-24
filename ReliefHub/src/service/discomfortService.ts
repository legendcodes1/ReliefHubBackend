import { createDiscomfortTypeRepo, deleteDiscomfortTypeRepo, getDiscomfortRepo, updateDiscomfortTypeRepo } from "../repositories/discomfortRepo.js";
import discomfortType from "../dto/discomfortType.js"


export const getDiscomfortService = async() => {
    try {
        const discomfortData = await getDiscomfortRepo()
        return discomfortData;
    } catch (error) {
        throw error;
    }
}

export const createDiscomfortService = async(data:discomfortType ) => {
        if(!data.name){
            return "Name of discomfort is required"
        }
        const createDiscomfortData = await createDiscomfortTypeRepo(data)
        return createDiscomfortData;
}

export const updateDiscomfortService = async(id: string, data:discomfortType ) => {
        if(!data.name || !id){
            return "discomfort not found"
        }
        const updateDiscomfortData = await updateDiscomfortTypeRepo(id, data)
        return updateDiscomfortData;
}

export const deleteDiscomfortService = async(id: string ) => {
        if(!id){
            return "discomfort not found"
        }
        const deleteDiscomfortData = await deleteDiscomfortTypeRepo(id)
        return deleteDiscomfortData;
}