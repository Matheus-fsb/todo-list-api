import type { ITaskRepository } from './tasks.repository.js';
import { AppError } from '../../errors/AppError.js';

import type { IProjectRepository } from '../projects/projects.repository.js';

import type { CreateTaskDTO, TaskResponseDTO, UpdateTaskWithAuthDTO, DeleteTaskWithAuthDTO } from './tasks.types.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';

export interface ITaskService {
  create(data: CreateTaskDTO): Promise<TaskResponseDTO>;
  update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO>;
  findByProject(projectId: string): Promise<TaskResponseDTO[]>;
  delete(data: DeleteTaskWithAuthDTO): Promise<void>;
}

type Dependencies = { taskRepository: ITaskRepository; projectRepository: IProjectRepository };

export class TaskService implements ITaskService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
    createTaskSchema.parse(data);

    const projectExists = await this.deps.projectRepository.findById(data.projectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    return this.deps.taskRepository.create(data);
  }

  async update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO> {
    updateTaskSchema.parse(data.data);

    const taskExists = await this.deps.taskRepository.findById(data.targetTaskId);
    if (!taskExists) {
      throw new AppError('Task not found', 404);
    }

    const projectExists = await this.deps.projectRepository.findById(taskExists.projectId);
    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isSelfUpdate = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfUpdate && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    if (data.data.status === 'COMPLETED') {
      data.data.completedAt = new Date();
    }

    if (data.data.status && data.data.status !== 'COMPLETED') {
      data.data.completedAt = null;
    }

    return this.deps.taskRepository.update(data.targetTaskId, data.data);
  }

  async findByProject(projectId: string): Promise<TaskResponseDTO[]> {
    return this.deps.taskRepository.findByProject(projectId);
  }

  async delete(data: DeleteTaskWithAuthDTO): Promise<void> {
    const taskExists = await this.deps.taskRepository.findById(data.targetTaskId);
    if (!taskExists) {
      throw new AppError('Task not found', 404);
    }

    const projectExists = await this.deps.projectRepository.findById(taskExists.projectId);
    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isSelfDelete = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    await this.deps.taskRepository.delete(data.targetTaskId);
  }
}
