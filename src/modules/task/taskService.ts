import type { ITaskRepository } from './taskRepository.js';

import type { IProjectRepository } from '../project/projectRepository.js';

import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskResponseDTO,
} from './taskTypes.js';
import { createTaskSchema, updateTaskSchema } from './taskSchema.js';

export interface ITaskService {
  create(data: CreateTaskDTO): Promise<TaskResponseDTO>;
  update(id: string, data: UpdateTaskDTO): Promise<TaskResponseDTO>;
  findByProject(projectId: string): Promise<TaskResponseDTO[]>;
  delete(id: string): Promise<void>;
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

  async update(id: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
    updateTaskSchema.parse(data)

    if (data.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    if (data.status && data.status !== 'COMPLETED') {
      data.completedAt = null;
    }

    return this.deps.taskRepository.update(id, data);
  }

  async findByProject(projectId: string): Promise<TaskResponseDTO[]> {
    return this.deps.taskRepository.findByProject(projectId);
  }

  async delete(id: string): Promise<void> {
    await this.deps.taskRepository.delete(id);
  }
}
