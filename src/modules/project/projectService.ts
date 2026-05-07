import { type IProjectRepository } from './projectRepository.js';
import type { CreateProjectDTO, ProjectResponseDTO } from './projectTypes.js';
import { type IUserRepository } from '../user/userRepository.js';

export interface IProjectService {
  create(data: CreateProjectDTO): Promise<ProjectResponseDTO>;
  findByUser(userId: string): Promise<ProjectResponseDTO[]>;
}

type Dependencies = {
  projectRepository: IProjectRepository;
  userRepository: IUserRepository;
};

export class ProjectService implements IProjectService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    const userExists = await this.deps.userRepository.findById(data.userId);

    if (!userExists) {
      throw new Error('User not found');
    }

    const project = await this.deps.projectRepository.create(data);

    return project;
  }

  async findByUser(userId: string): Promise<ProjectResponseDTO[]> {
    return this.deps.projectRepository.findByUser(userId);
  }
}
