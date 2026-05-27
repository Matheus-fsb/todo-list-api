import { prisma } from '../../lib/prisma.js';
import type { Task } from '../../generated/prisma/client.js';
import { Status } from '../../generated/prisma/enums.js';
import type { CreateTaskDTO, FindTasksFiltersDTO, UpdateTaskPersistenceDTO } from './tasks.types.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';

export interface ITaskRepository {
  create(data: CreateTaskDTO): Promise<Task>;
  findById(id: string): Promise<Task | null>;
  findAll(): Promise<Task[]>;
  findByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>>;
  findByProject(projectId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>>;
  findAllByProject(projectId: string): Promise<Task[]>;
  findOverdueByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>>;
  update(id: string, data: UpdateTaskPersistenceDTO): Promise<Task>;
  delete(id: string): Promise<Task>;
}

export class TaskRepository implements ITaskRepository {
  async create(data: CreateTaskDTO): Promise<Task> {
    return prisma.task.create({ data });
  }

  async findById(id: string): Promise<Task | null> {
    return prisma.task.findFirst({ where: { id, deletedAt: null } });
  }

  async findAll(): Promise<Task[]> {
    return prisma.task.findMany({ where: { deletedAt: null } });
  }

  async findAllByProject(projectId: string): Promise<Task[]> {
    return prisma.task.findMany({ where: { projectId, deletedAt: null } });
  }

  async findByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>> {
    const skip = (filters.page - 1) * filters.limit;

    const where = {
      deletedAt: null,
      project: { userId },
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: filters.limit, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);

    return {
      items: tasks,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async findByProject(projectId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>> {
    const skip = (filters.page - 1) * filters.limit;

    const where = {
      projectId,
      deletedAt: null,
      ...(filters.status && { status: filters.status }),
      ...(filters.priority && { priority: filters.priority }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: filters.limit, orderBy: { createdAt: 'desc' } }),
      prisma.task.count({ where }),
    ]);

    return {
      items: tasks,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async findOverdueByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<Task>> {
    const skip = (filters.page - 1) * filters.limit;

    const where = {
      deletedAt: null,
      dueDate: { lt: new Date() },
      status: { not: Status.COMPLETED },
      project: { userId },
      ...(filters.priority && { priority: filters.priority }),
    };

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({ where, skip, take: filters.limit, orderBy: { dueDate: 'asc' } }),
      prisma.task.count({ where }),
    ]);

    return {
      items: tasks,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async update(id: string, data: UpdateTaskPersistenceDTO): Promise<Task> {
    return prisma.task.update({ where: { id }, data });
  }

  async delete(id: string): Promise<Task> {
    return prisma.task.delete({ where: { id } });
  }
}
