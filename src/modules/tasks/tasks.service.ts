import type { ITaskRepository } from './tasks.repository.js';
import { AppError } from '../../errors/AppError.js';

import type { IProjectRepository } from '../projects/projects.repository.js';

import type {
  CreateTaskDTO,
  CreateTaskWithAuthDTO,
  DeleteTaskWithAuthDTO,
  FindTaskWithAuthDTO,
  FindTasksFiltersDTO,
  TaskResponseDTO,
  UpdateTaskDTO,
  UpdateTaskPersistenceDTO,
  UpdateTaskWithAuthDTO,
} from './tasks.types.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';

export interface ITaskService {
  create(data: CreateTaskWithAuthDTO): Promise<TaskResponseDTO>;
  update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO>;
  findById(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO>;
  findByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>>;
  findByProject(projectId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>>;
  findAllByProject(projectId: string): Promise<TaskResponseDTO[]>;
  findOverdueByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>>;
  complete(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO>;
  reopen(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO>;
  delete(data: DeleteTaskWithAuthDTO): Promise<void>;
  softDelete(data: DeleteTaskWithAuthDTO): Promise<void>;
}

type Dependencies = { taskRepository: ITaskRepository; projectRepository: IProjectRepository };

function removeUndefinedFields<T extends object>(data: T): T {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
}

export class TaskService implements ITaskService {
  constructor(private deps: Dependencies) {}

  private async ensureTaskAccess(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO> {
    const taskExists = await this.deps.taskRepository.findById(data.targetTaskId);
    if (!taskExists) {
      throw new AppError('Task not found', 404);
    }

    const projectExists = await this.deps.projectRepository.findById(taskExists.projectId);
    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isOwner = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    return taskExists;
  }

  async create(data: CreateTaskWithAuthDTO): Promise<TaskResponseDTO> {
    const parsedData = removeUndefinedFields(createTaskSchema.parse(data.data)) as CreateTaskDTO;

    const projectExists = await this.deps.projectRepository.findById(parsedData.projectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isOwner = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    const today = new Date();

    if (parsedData.dueDate && parsedData.dueDate < today) {
      throw new AppError('Due date cannot be in the past', 400);
    }

    return this.deps.taskRepository.create(parsedData);
  }

  async update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO> {
    const parsedTaskData = removeUndefinedFields(updateTaskSchema.parse(data.data)) as UpdateTaskDTO;

    await this.ensureTaskAccess(data);

    const dataToUpdate: UpdateTaskPersistenceDTO = { ...parsedTaskData };

    if (parsedTaskData.status === 'COMPLETED') {
      dataToUpdate.completedAt = new Date();
    }

    if (parsedTaskData.status && parsedTaskData.status !== 'COMPLETED') {
      dataToUpdate.completedAt = null;
    }

    return this.deps.taskRepository.update(data.targetTaskId, dataToUpdate);
  }

  async findById(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO> {
    return this.ensureTaskAccess(data);
  }

  async findByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>> {
    return this.deps.taskRepository.findByUser(userId, filters);
  }

  async findByProject(projectId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>> {
    return this.deps.taskRepository.findByProject(projectId, filters);
  }

  async findAllByProject(projectId: string): Promise<TaskResponseDTO[]> {
    return this.deps.taskRepository.findAllByProject(projectId);
  }

  async findOverdueByUser(userId: string, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>> {
    return this.deps.taskRepository.findOverdueByUser(userId, filters);
  }

  async complete(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO> {
    await this.ensureTaskAccess(data);

    return this.deps.taskRepository.update(data.targetTaskId, { status: 'COMPLETED', completedAt: new Date() });
  }

  async reopen(data: FindTaskWithAuthDTO): Promise<TaskResponseDTO> {
    await this.ensureTaskAccess(data);

    return this.deps.taskRepository.update(data.targetTaskId, { status: 'PENDING', completedAt: null });
  }

  async delete(data: DeleteTaskWithAuthDTO): Promise<void> {
    await this.ensureTaskAccess(data);

    await this.deps.taskRepository.delete(data.targetTaskId);
  }

  async softDelete(data: DeleteTaskWithAuthDTO): Promise<void> {
    await this.ensureTaskAccess(data);

    await this.deps.taskRepository.update(data.targetTaskId, { deletedAt: new Date() });
  }
}
