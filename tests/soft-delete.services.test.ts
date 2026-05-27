import { describe, expect, it, jest, beforeEach, afterEach } from '@jest/globals';
import { ProjectService } from '../src/modules/projects/projects.service.js';
import { TaskService } from '../src/modules/tasks/tasks.service.js';
import { UserService } from '../src/modules/users/users.service.js';

describe('soft delete services', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-05-25T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('soft deletes a task', async () => {
    const taskRepository = {
      findById: jest.fn(async (_id: string) => ({ id: 'task-1', projectId: 'project-1' })),
      update: jest.fn(async (_id: string, _data: object) => ({ id: 'task-1' })),
    };
    const projectRepository = { findById: jest.fn(async (_id: string) => ({ id: 'project-1', userId: 'user-1' })) };
    const service = new TaskService({
      taskRepository,
      projectRepository,
      userRepository: {},
      taskNotificationService: {},
    } as any);

    await service.softDelete({ targetTaskId: 'task-1', authenticatedUserId: 'user-1', authenticatedUserRole: 'USER' });

    expect(taskRepository.update).toHaveBeenCalledWith('task-1', { deletedAt: new Date() });
  });

  it('soft deletes a project and its tasks', async () => {
    const projectRepository = {
      findById: jest.fn(async (_id: string) => ({ id: 'project-1', userId: 'user-1' })),
      update: jest.fn(async (_id: string, _data: object) => ({ id: 'project-1' })),
    };
    const taskService = {
      findAllByProject: jest.fn(async (_projectId: string) => [{ id: 'task-1' }, { id: 'task-2' }]),
      softDelete: jest.fn(async (_data: object) => undefined),
    };
    const userRepository = {
      findById: jest.fn(async (_id: string) => ({ id: 'user-1', name: 'Matheus', email: 'matheus@example.com' })),
    };
    const projectNotificationService = {
      createProjectDeletedNotification: jest.fn(async (_data: object) => undefined),
    };
    const service = new ProjectService({
      projectRepository,
      userRepository,
      taskRepository: {},
      taskService,
      projectNotificationService,
    } as any);

    await service.softDelete({
      targetProjectId: 'project-1',
      authenticatedUserId: 'user-1',
      authenticatedUserRole: 'USER',
    });

    expect(taskService.softDelete).toHaveBeenCalledTimes(2);
    expect(taskService.softDelete).toHaveBeenCalledWith({
      targetTaskId: 'task-1',
      authenticatedUserId: 'user-1',
      authenticatedUserRole: 'USER',
    });
    expect(taskService.softDelete).toHaveBeenCalledWith({
      targetTaskId: 'task-2',
      authenticatedUserId: 'user-1',
      authenticatedUserRole: 'USER',
    });
    expect(projectRepository.update).toHaveBeenCalledWith('project-1', { deletedAt: new Date() });
  });

  it('soft deletes a user and their projects', async () => {
    const userRepository = {
      findById: jest.fn(async (_id: string) => ({ id: 'user-1' })),
      update: jest.fn(async (_id: string, _data: object) => ({ id: 'user-1' })),
    };
    const projectService = {
      findAllByUser: jest.fn(async (_userId: string) => [{ id: 'project-1' }, { id: 'project-2' }]),
      softDelete: jest.fn(async (_data: object) => undefined),
    };
    const service = new UserService({ userRepository, validationTokenService: {}, projectService } as any);

    await service.softDelete({ targetUserId: 'user-1', authenticatedUserId: 'user-1', authenticatedUserRole: 'USER' });

    expect(projectService.softDelete).toHaveBeenCalledTimes(2);
    expect(projectService.softDelete).toHaveBeenCalledWith({
      targetProjectId: 'project-1',
      authenticatedUserId: 'user-1',
      authenticatedUserRole: 'USER',
    });
    expect(projectService.softDelete).toHaveBeenCalledWith({
      targetProjectId: 'project-2',
      authenticatedUserId: 'user-1',
      authenticatedUserRole: 'USER',
    });
    expect(userRepository.update).toHaveBeenCalledWith('user-1', { deletedAt: new Date() });
  });
});
