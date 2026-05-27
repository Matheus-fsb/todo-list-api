import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import { Priority, Status } from '../../generated/prisma/enums.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import { type IProjectService } from './projects.service.js';
import type { FindProjectsFiltersDTO } from './projects.types.js';
import type { FindTasksFiltersDTO } from '../tasks/tasks.types.js';

export interface IProjectController {
  create(req: Request, res: Response): Promise<Response>;
  findById(req: Request, res: Response): Promise<Response>;
  findMine(req: Request, res: Response): Promise<Response>;
  findDeleted(req: Request, res: Response): Promise<Response>;
  findTasks(req: Request, res: Response): Promise<Response>;
  findByUser(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  softDelete(req: Request, res: Response): Promise<Response>;
  restore(req: Request, res: Response): Promise<Response>;
}

export class ProjectController implements IProjectController {
  constructor(private projectService: IProjectService) {}

  private parseProjectFilters(req: Request): FindProjectsFiltersDTO {
    const { page, limit } = req.query;

    const filters = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

    if (filters.page < 1) {
      throw new AppError('Invalid page', 400);
    }

    if (filters.limit < 1) {
      throw new AppError('Invalid limit', 400);
    }

    return filters;
  }

  private parseTaskFilters(req: Request): FindTasksFiltersDTO {
    const { page, limit, status, priority } = req.query;

    if (status && (Array.isArray(status) || !Object.values(Status).includes(status as Status))) {
      throw new AppError('Invalid status', 400);
    }

    if (priority && (Array.isArray(priority) || !Object.values(Priority).includes(priority as Priority))) {
      throw new AppError('Invalid priority', 400);
    }

    const filters: FindTasksFiltersDTO = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    };

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

    const project = await this.projectService.create({
      authenticatedUserId: req.user.id,
      data: req.body,
    });

    return res.status(201).json(successResponse('Project created successfully', project));
  }

  async findById(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const project = await this.projectService.findById({
      targetProjectId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Project found successfully', project));
  }

  async findMine(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const projects = await this.projectService.findMine(req.user.id, this.parseProjectFilters(req));

    return res.status(200).json(successResponse('Projects listed successfully', projects));
  }

  async findDeleted(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const projects = await this.projectService.findDeleted(req.user.id, req.user.role, this.parseProjectFilters(req));

    return res.status(200).json(successResponse('Deleted projects listed successfully', projects));
  }

  async findTasks(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const tasks = await this.projectService.findTasks(
      {
        targetProjectId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
      },
      this.parseTaskFilters(req),
    );

    return res.status(200).json(successResponse('Project tasks listed successfully', tasks));
  }

  async findByUser(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    if (!userId || Array.isArray(userId)) {
      throw new AppError('Invalid userId', 400);
    }

    const projects = await this.projectService.findByUser(userId, this.parseProjectFilters(req));

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

  async softDelete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    await this.projectService.softDelete({
      targetProjectId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Project deleted successfully'));
  }

  async restore(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const project = await this.projectService.restore({
      targetProjectId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('Project restored successfully', project));
  }
}
