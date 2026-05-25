import { prisma } from '../../lib/prisma.js';
import type { Project } from '../../generated/prisma/client.js';
import type { CreateProjectDTO, UpdateProjectPersistenceDTO } from './projects.types.js';

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByUser(userId: string): Promise<Project[]>;
  update(id: string, data: UpdateProjectPersistenceDTO): Promise<Project>;
  delete(id: string): Promise<Project>;
}

export class ProjectRepository implements IProjectRepository {
  async create(data: CreateProjectDTO): Promise<Project> {
    return prisma.project.create({ data });
  }

  async findById(id: string): Promise<Project | null> {
    return prisma.project.findFirst({ where: { id, deletedAt: null } });
  }

  async findAll(): Promise<Project[]> {
    return prisma.project.findMany({ where: { deletedAt: null } });
  }

  async findByUser(userId: string): Promise<Project[]> {
    return prisma.project.findMany({ where: { userId, deletedAt: null } });
  }

  async update(id: string, data: UpdateProjectPersistenceDTO): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
