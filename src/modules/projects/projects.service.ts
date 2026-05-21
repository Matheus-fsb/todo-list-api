import { type IProjectRepository } from './projects.repository.js';
import type {
  CreateProjectDTO,
  ProjectResponseDTO,
  UpdateProjectWithAuthDTO,
  DeleteProjectWithAuthDTO,
} from './projects.types.js';
import { type IUserRepository } from '../users/users.repository.js';
import {
  createProjectSchema,
  updateProjectSchema,
} from './projects.schemas.js';

export interface IProjectService {
  create(data: CreateProjectDTO): Promise<ProjectResponseDTO>;
  findByUser(userId: string): Promise<ProjectResponseDTO[]>;
  update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO>;
  delete(data: DeleteProjectWithAuthDTO): Promise<void>;
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

  async update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    updateProjectSchema.parse(data.data);

    const projectExists = await this.deps.projectRepository.findById(
      data.targetProjectId,
    );

    if (!projectExists) {
      throw new Error('Project not found');
    }

    const isSelfUpdate = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfUpdate && !isAdmin) {
      throw new Error('Forbidden');
    }

    const updatedProject = await this.deps.projectRepository.update(
      data.targetProjectId,
      data.data,
    );

    return updatedProject;
  }

  async delete(data: DeleteProjectWithAuthDTO): Promise<void> {
    const projectExists = await this.deps.projectRepository.findById(
      data.targetProjectId,
    );

    if (!projectExists) {
      throw new Error('Project not found');
    }

    const isSelfDelete = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new Error('Forbidden');
    }

    await this.deps.projectRepository.delete(data.targetProjectId);
  }
}
