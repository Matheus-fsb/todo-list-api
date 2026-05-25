import type { ITaskRepository } from './tasks.repository.js';
import { AppError } from '../../errors/AppError.js';

import type { IProjectRepository } from '../projects/projects.repository.js';

import type {
  CreateTaskDTO,
  DeleteTaskWithAuthDTO,
  TaskResponseDTO,
  UpdateTaskDTO,
  UpdateTaskPersistenceDTO,
  UpdateTaskWithAuthDTO,
} from './tasks.types.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';

export interface ITaskService {
  create(data: CreateTaskDTO): Promise<TaskResponseDTO>;
  update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO>;
  findByProject(projectId: string): Promise<TaskResponseDTO[]>;
  delete(data: DeleteTaskWithAuthDTO): Promise<void>;
}

type Dependencies = { taskRepository: ITaskRepository; projectRepository: IProjectRepository };

function removeUndefinedFields<T extends object>(data: T): T {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
}

export class TaskService implements ITaskService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
    const parsedData = removeUndefinedFields(createTaskSchema.parse(data)) as CreateTaskDTO;

    const projectExists = await this.deps.projectRepository.findById(parsedData.projectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const today = new Date();

    if (parsedData.dueDate && parsedData.dueDate < today) {
      throw new AppError('Due date cannot be in the past', 400);
    }

    return this.deps.taskRepository.create(parsedData);
  }

  async update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO> {
    const parsedTaskData = removeUndefinedFields(updateTaskSchema.parse(data.data)) as UpdateTaskDTO;

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

    const dataToUpdate: UpdateTaskPersistenceDTO = { ...parsedTaskData };

    if (parsedTaskData.status === 'COMPLETED') {
      dataToUpdate.completedAt = new Date();
    }

    if (parsedTaskData.status && parsedTaskData.status !== 'COMPLETED') {
      dataToUpdate.completedAt = null;
    }

    return this.deps.taskRepository.update(data.targetTaskId, dataToUpdate);
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
