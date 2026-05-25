import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import { type IProjectService } from './projects.service.js';

export interface IProjectController {
  create(req: Request, res: Response): Promise<Response>;
  findByUser(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
}

export class ProjectController implements IProjectController {
  constructor(private projectService: IProjectService) {}

  async create(req: Request, res: Response): Promise<Response> {
    const project = await this.projectService.create(req.body);

    return res.status(201).json(successResponse('Project created successfully', project));
  }

  async findByUser(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      throw new AppError('Invalid userId', 400);
    }

    const projects = await this.projectService.findByUser(userId);

    return res.status(200).json(successResponse('Projects listed successfully', projects));
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const updatedProject = await this.projectService.update({
      targetProjectId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
      data: req.body,
    });

    return res.status(200).json(successResponse('Project updated successfully', updatedProject));
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    await this.projectService.delete({
      targetProjectId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Project deleted successfully'));
  }
}
