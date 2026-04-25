import type { Request, Response } from 'express';
import type { IUserService } from './userService.js';

export interface IUserController {
  create(req: Request, res: Response): Promise<Response>;
  findAll(req: Request, res: Response): Promise<Response>;
}

export class UserController implements UserController {
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
}
