import type { Request, Response } from 'express';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';
import type { IUserService } from './users.service.js';

export interface IUserController {
  create(req: Request, res: Response): Promise<Response>;
  findAll(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  findById(req: Request, res: Response): Promise<Response>;
  softDelete(req: Request, res: Response): Promise<Response>;
}

export class UserController implements IUserController {
  constructor(private userService: IUserService) {}

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

  async findAll(req: Request, res: Response): Promise<Response> {
    const users = await this.userService.findAll();

    return res.status(200).json(successResponse('Users listed successfully', users));
  }

  async findById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    if (!id || Array.isArray(id)) {
      throw new AppError('Invalid id', 400);
    }

    const user = await this.userService.findById(id);

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
}
