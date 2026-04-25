import discomfortType from "../dto/discomfortType.js";
import { prisma } from "../lib/prisma.js";

export const getDiscomfortService = async () => {
  try {
    return prisma.discomfort_types.findMany();
  } catch (error) {
    throw error;
  }
};

export const createDiscomfortService = async (data: discomfortType) => {
  if (!data.name) {
    return "Name of discomfort is required";
  }
  return prisma.discomfort_types.create({
    data: {
      ...data,
    },
  });
};

export const updateDiscomfortService = async ( id: string, data: discomfortType,) => {
  if (!data.name || !id) {
    return "discomfort not found";
  }
    return prisma.discomfort_types.update({
       where :  {id},
      data: { ...data }
    })
};

export const deleteDiscomfortService = async (id: string) => {
  if (!id) {
    return "discomfort not found";
  }
     return prisma.discomfort_types.delete({
       where :  {id}
    })
};
