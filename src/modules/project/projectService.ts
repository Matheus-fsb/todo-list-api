import { ProjectRepository } from './projectRepository.js';
import type { CreateProjectDTO, ProjectResponseDTO } from './projectTypes.js';
import { UserRepository } from '../user/userRepository.js';

const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();

export class ProjectService {
  async create(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const userExists = await userRepository.findById(data.userId);

    if (!userExists) {
      throw new Error('User not found');
    }

    const project = await projectRepository.create(data);

    return project;
  }

  async findByUser(userId: string): Promise<ProjectResponseDTO[]> {
    return projectRepository.findByUser(userId);
  }
}
