import { prisma } from '../../lib/prisma.js';
import type { Project } from '../../generated/prisma/client.js';
import type { CreateProjectDTO, UpdateProjectDTO } from './projectTypes.js';

export class ProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    return prisma.project.create({
      data,
    });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Project[]> {
    return prisma.project.findMany();
  }

  async findByUser(userId: string): Promise<Project[]> {
    return prisma.project.findMany({
      where: { userId },
    });
  }

  async update(id: string, data: UpdateProjectDTO): Promise<Project> {
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({
      where: { id },
    });
  }
}
