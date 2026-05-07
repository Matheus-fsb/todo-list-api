import { prisma } from '../../lib/prisma.js';
import type { Project } from '../../generated/prisma/client.js';
import type { CreateProjectDTO, UpdateProjectDTO } from './projects.types.js';

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByUser(userId: string): Promise<Project[]>;
  update(id: string, data: UpdateProjectDTO): Promise<Project>;
  delete(id: string): Promise<Project>;
}

export class ProjectRepository implements IProjectRepository {
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
