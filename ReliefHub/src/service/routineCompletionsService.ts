import { prisma } from "../lib/prisma.js"

export const getRoutineCompleteRepo = async () =>{
     return prisma.routine_completions.findMany()
}

export const createDiscomfortTypeRepo = async (data: routineType) =>{
     return prisma.discomfort_types.create({
       data: {
            ...data,
        },
})
}

export const updateDiscomfortTypeRepo = async (id: string, data: discomfortType) =>{
     return prisma.discomfort_types.update({
       where :  {id},
      data: { ...data }
    })
}


export const deleteDiscomfortTypeRepo = async (id: string) =>{
     return prisma.discomfort_types.delete({
       where :  {id}
    })
}