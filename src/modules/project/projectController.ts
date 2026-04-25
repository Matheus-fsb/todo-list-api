import type { Request, Response } from 'express';
import { type IProjectService } from './projectService.js';

export interface IProjectController {
  create(req: Request, res: Response): Promise<Response>;
  findByUser(req: Request, res: Response): Promise<Response>;
}

export class ProjectController implements IProjectController {
  constructor(private projectService: IProjectService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const project = await this.projectService.create(req.body);
      return res.status(201).json(project);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async findByUser(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.params;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }

      const projects = await this.projectService.findByUser(userId);
      return res.json(projects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
