import type { ITaskRepository } from './taskRepository.js';
import type { IProjectRepository } from '../project/projectRepository.js';
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskResponseDTO,
} from './taskTypes.js';

export class TaskService {
  constructor(
    private taskRepository: ITaskRepository,
    private projectRepository: IProjectRepository
  ) {}

  async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
    const projectExists = await this.projectRepository.findById(data.projectId);

    if (!projectExists) {
      throw new Error('Project not found');
    }

    return this.taskRepository.create(data);
  }

  async update(id: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
    if (data.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    if (data.status && data.status !== 'COMPLETED') {
      data.completedAt = null;
    }

    return this.taskRepository.update(id, data);
  }

  async findByProject(projectId: string): Promise<TaskResponseDTO[]> {
    return this.taskRepository.findByProject(projectId);
  }

  async delete(id: string): Promise<void> {
    await this.taskRepository.delete(id);
  }
}
