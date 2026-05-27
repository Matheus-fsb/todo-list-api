import { type IProjectRepository } from './projects.repository.js';
import type {
  CreateProjectDTO,
  CreateProjectWithAuthDTO,
  ProjectResponseDTO,
  UpdateProjectWithAuthDTO,
  DeleteProjectWithAuthDTO,
  FindProjectWithAuthDTO,
  FindProjectsFiltersDTO,
} from './projects.types.js';
import { type IUserRepository } from '../users/users.repository.js';
import { createProjectSchema, updateProjectSchema } from './projects.schemas.js';
import { AppError } from '../../errors/AppError.js';
import type { ITaskRepository } from '../tasks/tasks.repository.js';
import type { ITaskService } from '../tasks/tasks.service.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';
import type { FindTasksFiltersDTO, TaskResponseDTO } from '../tasks/tasks.types.js';
import type { IProjectNotificationService } from '../notifications/notification-project.service.js';

export interface IProjectService {
  create(data: CreateProjectWithAuthDTO): Promise<ProjectResponseDTO>;
  findById(data: FindProjectWithAuthDTO): Promise<ProjectResponseDTO>;
  findMine(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<ProjectResponseDTO>>;
  findDeleted(
    userId: string,
    role: string,
    filters: FindProjectsFiltersDTO,
  ): Promise<PaginatedResponse<ProjectResponseDTO>>;
  findTasks(data: FindProjectWithAuthDTO, filters: FindTasksFiltersDTO): Promise<PaginatedResponse<TaskResponseDTO>>;
  findByUser(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<ProjectResponseDTO>>;
  findAllByUser(userId: string): Promise<ProjectResponseDTO[]>;
  update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO>;
  delete(data: DeleteProjectWithAuthDTO): Promise<void>;
  softDelete(data: DeleteProjectWithAuthDTO): Promise<void>;
  restore(data: FindProjectWithAuthDTO): Promise<ProjectResponseDTO>;
}

type Dependencies = {
  projectRepository: IProjectRepository;
  userRepository: IUserRepository;
  taskRepository: ITaskRepository;
  taskService: ITaskService;
  projectNotificationService: IProjectNotificationService;
};

function removeUndefinedFields<T extends object>(data: T): T {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
}

export class ProjectService implements IProjectService {
  constructor(private deps: Dependencies) {}

  private async notifyProject(
    project: ProjectResponseDTO,
    notification: (data: {
      project: Pick<ProjectResponseDTO, 'name'>;
      user: { name: string; email: string };
    }) => Promise<unknown>,
  ): Promise<void> {
    try {
      const user = await this.deps.userRepository.findById(project.userId);

      if (!user) {
        return;
      }

      await notification({
        project: { name: project.name },
        user: { name: user.name, email: user.email },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending project notification:', error.message);
      }
    }
  }

  private async ensureProjectAccess(data: FindProjectWithAuthDTO, includeDeleted = false): Promise<ProjectResponseDTO> {
    const projectExists = includeDeleted
      ? await this.deps.projectRepository.findByIdWithDeleted(data.targetProjectId)
      : await this.deps.projectRepository.findById(data.targetProjectId);

    if (!projectExists) {
      throw new AppError('Project not found', 404);
    }

    const isOwner = projectExists.userId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    return projectExists;
  }

  async create(data: CreateProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    const parsedData = removeUndefinedFields(
      createProjectSchema.parse({ ...data.data, userId: data.authenticatedUserId }),
    ) as CreateProjectDTO;

    const userExists = await this.deps.userRepository.findById(data.authenticatedUserId);

    if (!userExists) {
      throw new AppError('User not found', 404);
    }

    const project = await this.deps.projectRepository.create(parsedData);

    await this.notifyProject(project, (notificationData) =>
      this.deps.projectNotificationService.createProjectCreatedNotification(notificationData),
    );

    return project;
  }

  async findById(data: FindProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    return this.ensureProjectAccess(data);
  }

  async findMine(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<ProjectResponseDTO>> {
    return this.deps.projectRepository.findByUser(userId, filters);
  }

  async findDeleted(
    userId: string,
    role: string,
    filters: FindProjectsFiltersDTO,
  ): Promise<PaginatedResponse<ProjectResponseDTO>> {
    const targetUserId = role === 'ADMIN' ? undefined : userId;

    return this.deps.projectRepository.findDeleted(filters, targetUserId);
  }

  async findTasks(
    data: FindProjectWithAuthDTO,
    filters: FindTasksFiltersDTO,
  ): Promise<PaginatedResponse<TaskResponseDTO>> {
    await this.ensureProjectAccess(data);

    return this.deps.taskService.findByProject(data.targetProjectId, filters);
  }

  async findByUser(userId: string, filters: FindProjectsFiltersDTO): Promise<PaginatedResponse<ProjectResponseDTO>> {
    return this.deps.projectRepository.findByUser(userId, filters);
  }

  async findAllByUser(userId: string): Promise<ProjectResponseDTO[]> {
    return this.deps.projectRepository.findAllByUser(userId);
  }

  async update(data: UpdateProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    updateProjectSchema.parse(data.data);

    await this.ensureProjectAccess(data);

    const updatedProject = await this.deps.projectRepository.update(data.targetProjectId, data.data);

    return updatedProject;
  }

  async delete(data: DeleteProjectWithAuthDTO): Promise<void> {
    const project = await this.ensureProjectAccess(data);

    await this.deps.projectRepository.delete(data.targetProjectId);

    await this.notifyProject(project, (notificationData) =>
      this.deps.projectNotificationService.createProjectDeletedNotification(notificationData),
    );
  }

  async softDelete(data: DeleteProjectWithAuthDTO): Promise<void> {
    const project = await this.ensureProjectAccess(data);

    const tasks = await this.deps.taskService.findAllByProject(data.targetProjectId);

    for (const task of tasks) {
      await this.deps.taskService.softDelete({
        targetTaskId: task.id,
        authenticatedUserId: data.authenticatedUserId,
        authenticatedUserRole: data.authenticatedUserRole,
      });
    }

    await this.deps.projectRepository.update(data.targetProjectId, { deletedAt: new Date() });

    await this.notifyProject(project, (notificationData) =>
      this.deps.projectNotificationService.createProjectDeletedNotification(notificationData),
    );
  }

  async restore(data: FindProjectWithAuthDTO): Promise<ProjectResponseDTO> {
    await this.ensureProjectAccess(data, true);

    const project = await this.deps.projectRepository.update(data.targetProjectId, { deletedAt: null });

    await this.notifyProject(project, (notificationData) =>
      this.deps.projectNotificationService.createProjectRestoredNotification(notificationData),
    );

    return project;
  }
}
