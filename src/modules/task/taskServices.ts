import { prisma } from "../../lib/prisma.js";
import type { DataTask } from "../types.js";
import type { Status, Priority } from "../types.js";

export const createTask = async (data: {
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  projectId: string;
}) => {
  return prisma.task.create({ data });
};

export const getTasks = async () => {
  return prisma.task.findMany({
    include: { project: true },
  });
};

export const getTaskById = async (id: string) => {
  return prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });
};

export const getTasksByProject = async (projectId: string) => {
  return prisma.task.findMany({
    where: { projectId },
  });
};

export const updateTask = async (id: string, data: DataTask) => {
  // regra: se marcar como concluída
  if (data.status === "COMPLETED") {
    data.completedAt = new Date();
  }

  return prisma.task.update({
    where: { id },
    data,
  });
};

export const deleteTask = async (id: string) => {
  return prisma.task.delete({
    where: { id },
  });
};
