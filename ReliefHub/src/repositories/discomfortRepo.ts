import { prisma } from "../lib/prisma.js"
import discomfortType from "../dto/discomfortType.js"

export const getDiscomfortRepo = async () =>{
     return prisma.discomfort_types.findMany()
}

export const createDiscomfortTypeRepo = async (data: discomfortType) =>{
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