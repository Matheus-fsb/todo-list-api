import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import type { TaskService } from './tasks.service.js';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const task = await this.taskService.create(req.body);

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

  async findByProject(req: Request, res: Response): Promise<Response> {
    const { projectId } = req.params;

    if (!projectId || Array.isArray(projectId)) {
      throw new AppError('Invalid projectId', 400);
    }

    const tasks = await this.taskService.findByProject(projectId);

    return res.status(200).json(successResponse('Tasks listed successfully', tasks));
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
}
