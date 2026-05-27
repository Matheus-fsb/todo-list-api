import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import type { TaskService } from './tasks.service.js';
import { Priority, Status } from '../../generated/prisma/enums.js';
import type { FindTasksFiltersDTO } from './tasks.types.js';

export class TaskController {
  constructor(private taskService: TaskService) {}

  private parseFilters(req: Request): FindTasksFiltersDTO {
    const { page, limit, status, priority } = req.query;

    if (status && (Array.isArray(status) || !Object.values(Status).includes(status as Status))) {
      throw new AppError('Invalid status', 400);
    }

    if (priority && (Array.isArray(priority) || !Object.values(Priority).includes(priority as Priority))) {
      throw new AppError('Invalid priority', 400);
    }

    const filters: FindTasksFiltersDTO = { page: Number(page) || 1, limit: Number(limit) || 10 };

    if (filters.page < 1) {
      throw new AppError('Invalid page', 400);
    }

    if (filters.limit < 1) {
      throw new AppError('Invalid limit', 400);
    }

    if (typeof status === 'string') {
      filters.status = status as Status;
    }

    if (typeof priority === 'string') {
      filters.priority = priority as Priority;
    }

    return filters;
  }

  async create(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const task = await this.taskService.create({
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
      data: req.body,
    });

    return res.status(201).json(successResponse('Task created successfully', task));
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const task = await this.taskService.update({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
      data: req.body,
    });

    return res.status(200).json(successResponse('Task updated successfully', task));
  }

  async findById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const task = await this.taskService.findById({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Task found successfully', task));
  }

  async findMine(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const tasks = await this.taskService.findByUser(req.user.id, this.parseFilters(req));

    return res.status(200).json(successResponse('Tasks listed successfully', tasks));
  }

  async findByProject(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new AppError('Invalid projectId', 400);
    }

    const tasks = await this.taskService.findByProject(projectId, this.parseFilters(req));

    return res.status(200).json(successResponse('Tasks listed successfully', tasks));
  }

  async findOverdue(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const tasks = await this.taskService.findOverdueByUser(req.user.id, this.parseFilters(req));

    return res.status(200).json(successResponse('Overdue tasks listed successfully', tasks));
  }

  async complete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const task = await this.taskService.complete({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Task completed successfully', task));
  }

  async reopen(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const task = await this.taskService.reopen({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Task reopened successfully', task));
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    await this.taskService.delete({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Task deleted successfully'));
  }

  async softDelete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    await this.taskService.softDelete({
      targetTaskId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Task deleted successfully'));
  }
}
