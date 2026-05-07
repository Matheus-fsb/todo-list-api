import { type IProjectRepository } from './projects.repository.js';
import type { CreateProjectDTO, ProjectResponseDTO, UpdateProjectDTO } from './projects.types.js';
import { type IUserRepository } from '../users/users.repository.js';
import { createProjectSchema, updateProjectSchema } from './projects.schemas.js';

export interface IProjectService {
  create(data: CreateProjectDTO): Promise<ProjectResponseDTO>;
  findByUser(userId: string): Promise<ProjectResponseDTO[]>;
  update(id: string, data: UpdateProjectDTO): Promise<ProjectResponseDTO>;
}

type Dependencies = {
  projectRepository: IProjectRepository;
  userRepository: IUserRepository;
};

export class ProjectService implements IProjectService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    createProjectSchema.parse(data);

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

  async update(id: string, data: UpdateProjectDTO): Promise<ProjectResponseDTO> {
    updateProjectSchema.parse(data);

    const projectExists = await this.deps.projectRepository.findById(id);

    if (!projectExists) {
      throw new Error('Project not found');
    }

    const updatedProject = await this.deps.projectRepository.update(id, data);

    return updatedProject;
  }
}
