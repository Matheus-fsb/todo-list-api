import { prisma } from "../../lib/prisma.js";
import type { DataProject } from "../types.js";

export const createProject = async (data: {
  id: string;
  name: string;
  description?: string;
  userId: string;
}) => {
  return prisma.project.create({ data });
};

export const getProjects = async () => {
  return prisma.project.findMany({
    include: {
      tasks: true,
      user: true,
    },
  });
};

export const getProjectById = async (id: string) => {
  return prisma.project.findUnique({
    where: { id },
    include: {
      tasks: true,
      user: true,
    },
  });
};

export const getProjectsByUser = async (userId: string) => {
  return prisma.project.findMany({
    where: { userId },
  });
};

export const updateProject = async (id: string, data: DataProject) => {
  return prisma.project.update({
    where: { id },
    data,
  });
};

export const deleteProject = async (id: string) => {
  return prisma.project.delete({
    where: { id },
  });
};
