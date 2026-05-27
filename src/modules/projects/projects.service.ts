import { type IProjectRepository } from './projects.repository.js';
import type {
  CreateProjectDTO,
  ProjectResponseDTO,
  UpdateProjectWithAuthDTO,
  DeleteProjectWithAuthDTO,
} from './projects.types.js';
import { type IUserRepository } from '../users/users.repository.js';
import { createProjectSchema, updateProjectSchema } from './projects.schemas.js';
import { AppError } from '../../errors/AppError.js';
import type { ITaskRepository } from '../tasks/tasks.repository.js';
import type { ITaskService } from '../tasks/tasks.service.js';

export interface IProjectService {
  create(data: CreateProjectDTO): Promise<ProjectResponseDTO>;
  findByUser(userId: string): Promise<ProjectResponseDTO[]>;
  update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO>;
  delete(data: DeleteProjectWithAuthDTO): Promise<void>;
  softDelete(data: DeleteProjectWithAuthDTO): Promise<void>;
}

type Dependencies = {
  projectRepository: IProjectRepository;
  userRepository: IUserRepository;
  taskRepository: ITaskRepository;
  taskService: ITaskService;
};

export class ProjectService implements IProjectService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateProjectDTO): Promise<ProjectResponseDTO> {
    createProjectSchema.parse(data);

    const userExists = await this.deps.userRepository.findById(data.userId);

    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const project = await this.deps.projectRepository.create(data);

    return project;
  }

  async findByUser(userId: string): Promise<ProjectResponseDTO[]> {
    return this.deps.projectRepository.findByUser(userId);
  }

  async update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    updateProjectSchema.parse(data.data);

    const projectExists = await this.deps.projectRepository.findById(data.targetProjectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isSelfUpdate = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfUpdate && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    const updatedProject = await this.deps.projectRepository.update(data.targetProjectId, data.data);

    return updatedProject;
  }

  async delete(data: DeleteProjectWithAuthDTO): Promise<void> {
    const projectExists = await this.deps.projectRepository.findById(data.targetProjectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isSelfDelete = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    await this.deps.projectRepository.delete(data.targetProjectId);
  }

  async softDelete(data: DeleteProjectWithAuthDTO): Promise<void> {
    const projectExists = await this.deps.projectRepository.findById(data.targetProjectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isSelfDelete = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    const tasks = await this.deps.taskService.findAllByProject(data.targetProjectId);

    for (const task of tasks) {
      await this.deps.taskService.softDelete({
        targetTaskId: task.id,
        authenticatedUserId: data.authenticatedUserId,
        authenticatedUserRole: data.authenticatedUserRole,
      });
    }

    await this.deps.projectRepository.update(data.targetProjectId, { deletedAt: new Date() });
  }
}
