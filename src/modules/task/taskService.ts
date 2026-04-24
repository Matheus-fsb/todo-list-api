import { TaskRepository } from './taskRepository.js';
import { ProjectRepository } from '../project/projectRepository.js';
import type {
  CreateTaskDTO,
  UpdateTaskDTO,
  TaskResponseDTO,
} from './taskTypes.js';

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();

export class TaskService {
  async create(data: CreateTaskDTO): Promise<TaskResponseDTO> {
    const projectExists = await projectRepository.findById(data.projectId);

    if (!projectExists) {
      throw new Error('Project not found');
    }

    return taskRepository.create(data);
  }

  async update(id: string, data: UpdateTaskDTO): Promise<TaskResponseDTO> {
    if (data.status === 'COMPLETED') {
      data.completedAt = new Date();
    }

    if (data.status && data.status !== 'COMPLETED') {
      data.completedAt = null;
    }

    return taskRepository.update(id, data);
  }

  async findByProject(projectId: string): Promise<TaskResponseDTO[]> {
    return taskRepository.findByProject(projectId);
  }

  async delete(id: string): Promise<void> {
    await taskRepository.delete(id);
  }
}
