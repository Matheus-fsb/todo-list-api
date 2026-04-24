import { prisma } from '../../lib/prisma.js';
import type { Task } from '../../generated/prisma/client.js';
import type { CreateTaskDTO, UpdateTaskDTO } from './taskTypes.js';

export class TaskRepository {
  async create(data: CreateTaskDTO): Promise<Task> {
    return prisma.task.create({
      data,
    });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Task[]> {
    return prisma.task.findMany();
  }

  async findByProject(projectId: string): Promise<Task[]> {
    return prisma.task.findMany({
      where: { projectId },
    });
  }

  async update(id: string, data: UpdateTaskDTO): Promise<Task> {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({
      where: { id },
    });
  }
}
