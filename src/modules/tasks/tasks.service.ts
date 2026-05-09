import type { ITaskRepository } from './tasks.repository.js';

import type { IProjectRepository } from '../projects/projects.repository.js';

import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskResponseDTO,
  UpdateTaskWithAuthDTO,
  DeleteTaskWithAuthDTO,
} from './tasks.types.js';
import { createTaskSchema, updateTaskSchema } from './tasks.schemas.js';

export interface ITaskService {
  create(data: CreateTaskDTO): Promise<TaskResponseDTO>;
  update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO>;
  findByProject(projectId: string): Promise<TaskResponseDTO[]>;
  delete(data: DeleteTaskWithAuthDTO): Promise<void>;
}

type Dependencies = {
  taskRepository: ITaskRepository;
  projectRepository: IProjectRepository;
};

export class TaskService implements ITaskService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
    createTaskSchema.parse(data);

    const projectExists = await this.deps.projectRepository.findById(
      data.projectId
    );

    if (!projectExists) {
      throw new Error('Project not found');
    }

    return this.deps.taskRepository.create(data);
  }

  async update(data: UpdateTaskWithAuthDTO): Promise<TaskResponseDTO> {
    updateTaskSchema.parse(data.data)

    const taskExists = await this.deps.taskRepository.findById(data.targetTaskId);
    if (!taskExists) {
      throw new Error('Task not found');
    }

    const projectExists = await this.deps.projectRepository.findById(taskExists.projectId);
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const isSelfUpdate = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfUpdate && !isAdmin) {
      throw new Error('Forbidden');
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
      throw new Error('Task not found');
    }

    const projectExists = await this.deps.projectRepository.findById(taskExists.projectId);
    if (!projectExists) {
      throw new Error('Project not found');
    }

    const isSelfDelete = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new Error('Forbidden');
    }

    await this.deps.taskRepository.delete(data.targetTaskId);
  }
}
