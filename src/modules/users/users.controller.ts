import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import type { IUserService } from './users.service.js';
import type { FindUsersFiltersDTO } from './users.types.js';

export interface IUserController {
  create(req: Request, res: Response): Promise<Response>;
  findAll(req: Request, res: Response): Promise<Response>;
  findDeleted(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  deleteMe(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  updateMe(req: Request, res: Response): Promise<Response>;
  updatePassword(req: Request, res: Response): Promise<Response>;
  findById(req: Request, res: Response): Promise<Response>;
  findMe(req: Request, res: Response): Promise<Response>;
  softDelete(req: Request, res: Response): Promise<Response>;
  softDeleteMe(req: Request, res: Response): Promise<Response>;
  restore(req: Request, res: Response): Promise<Response>;
}

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

  private parseFilters(req: Request): FindUsersFiltersDTO {
    const { page, limit, emailVerified } = req.query;

    if (emailVerified && (Array.isArray(emailVerified) || !['true', 'false'].includes(String(emailVerified)))) {
      throw new AppError('Invalid emailVerified', 400);
    }

    const filters: FindUsersFiltersDTO = { page: Number(page) || 1, limit: Number(limit) || 10 };

    if (filters.page < 1) {
      throw new AppError('Invalid page', 400);
    }

    if (filters.limit < 1) {
      throw new AppError('Invalid limit', 400);
    }

    if (typeof emailVerified === 'string') {
      filters.emailVerified = emailVerified === 'true';
    }

    return filters;
  }

  async create(req: Request, res: Response): Promise<Response> {
    const user = await this.userService.create(req.body);

    return res.status(201).json(successResponse('User created successfully', user));
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid user id', 400);
    }

    const updatedUser = await this.userService.update({
      targetUserId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
      data: req.body,
    });

    return res.status(200).json(successResponse('User updated successfully', updatedUser));
  }

  async updateMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const updatedUser = await this.userService.update({
      targetUserId: req.user.id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
      data: req.body,
    });

    return res.status(200).json(successResponse('User updated successfully', updatedUser));
  }

  async updatePassword(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    await this.userService.updatePassword({ authenticatedUserId: req.user.id, data: req.body });

    return res.status(200).json(successResponse('Password updated successfully'));
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid user id', 400);
    }

    await this.userService.delete({
      targetUserId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('User deleted successfully'));
  }

  async deleteMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    await this.userService.softDelete({
      targetUserId: req.user.id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('User deleted successfully'));
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.findAll(this.parseFilters(req));

    return res.status(200).json(successResponse('Users listed successfully', users));
  }

  async findDeleted(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.findDeleted(this.parseFilters(req));

    return res.status(200).json(successResponse('Deleted users listed successfully', users));
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const user = await this.userService.findById(id);

    return res.status(200).json(successResponse('User found successfully', user));
  }

  async findMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    const user = await this.userService.findWithAuth({
      targetUserId: req.user.id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('User found successfully', user));
  }

  async softDelete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid user id', 400);
    }

    await this.userService.softDelete({
      targetUserId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });
    return res.status(200).json(successResponse('User deleted successfully'));
  }

  async softDeleteMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    await this.userService.softDelete({
      targetUserId: req.user.id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('User deleted successfully'));
  }

  async restore(req: AuthenticatedRequest, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid user id', 400);
    }

    const user = await this.userService.restore({
      targetUserId: id,
      authenticatedUserId: req.user.id,
      authenticatedUserRole: req.user.role,
    });

    return res.status(200).json(successResponse('User restored successfully', user));
  }
}
