import { prisma } from '../../lib/prisma.js';
import type { Project } from '../../generated/prisma/client.js';
import type { CreateProjectDTO, FindProjectsFiltersDTO, UpdateProjectPersistenceDTO } from './projects.types.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';

export interface IProjectRepository {
  create(data: CreateProjectDTO): Promise<Project>;
  findById(id: string): Promise<Project | null>;
  findByIdWithDeleted(id: string): Promise<Project | null>;
  findAll(): Promise<Project[]>;
  findByUser(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<Project>>;
  findAllByUser(userId: string): Promise<Project[]>;
  findDeleted(filters: FindProjectsFiltersDTO, userId?: string): Promise<PaginatedResponse<Project>>;
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

  async findByIdWithDeleted(id: string): Promise<Project | null> {
    return prisma.project.findUnique({ where: { id } });
  }

  async findAll(): Promise<Project[]> {
    return prisma.project.findMany({ where: { deletedAt: null } });
  }

  async findAllByUser(userId: string): Promise<Project[]> {
    return prisma.project.findMany({ where: { userId, deletedAt: null } });
  }

  async findByUser(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<Project>> {
    const skip = (filters.page - 1) * filters.limit;
    const where = { userId, deletedAt: null };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, skip, take: filters.limit, orderBy: { createdAt: 'desc' } }),
      prisma.project.count({ where }),
    ]);

    return {
      items: projects,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async findDeleted(filters: FindProjectsFiltersDTO, userId?: string): Promise<PaginatedResponse<Project>> {
    const skip = (filters.page - 1) * filters.limit;
    const where = {
      deletedAt: { not: null },
      ...(userId && { userId }),
    };

    const [projects, total] = await Promise.all([
      prisma.project.findMany({ where, skip, take: filters.limit, orderBy: { deletedAt: 'desc' } }),
      prisma.project.count({ where }),
    ]);

    return {
      items: projects,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async update(id: string, data: UpdateProjectPersistenceDTO): Promise<Project> {
    return prisma.project.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Project> {
    return prisma.project.delete({ where: { id } });
  }
}
