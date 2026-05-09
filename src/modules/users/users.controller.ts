import type { Request, Response } from 'express';
import type { IUserService } from './users.service.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';

export interface IUserController {
  create(req: Request, res: Response): Promise<Response>;
  findAll(req: Request, res: Response): Promise<Response>;
  delete(req: Request, res: Response): Promise<Response>;
  update(req: Request, res: Response): Promise<Response>;
  findById(req: Request, res: Response): Promise<Response>;
}

export class UserController implements IUserController {
  private userService: IUserService;

  constructor(userService: IUserService) {
    this.userService = userService;
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const user = await this.userService.create(req.body);
      return res.status(201).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          message: 'Invalid user id',
        });
      }

      const updatedUser = await this.userService.update({
        targetUserId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
        data: req.body,
      });

      return res.status(200).json(updatedUser);
    } catch (error) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      if (error instanceof Error && error.message === 'User not found') {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      if (error instanceof Error && error.message === 'Login already in use') {
        return res.status(409).json({
          message: 'Login already in use',
        });
      }

      return res.status(400).json({
        message: 'Invalid data',
      });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({
          message: 'Unauthorized',
        });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({
          message: 'Invalid user id',
        });
      }

      await this.userService.delete({
        targetUserId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
      });

      return res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({
          message: 'Forbidden',
        });
      }

      if (error instanceof Error && error.message === 'User not found') {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      return res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const users = await this.userService.findAll();
      return res.json(users);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async findById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const user = await this.userService.findById(id);

      return res.status(200).json(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(404).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
