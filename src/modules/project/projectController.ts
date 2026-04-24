import type { Request, Response } from 'express';
import { ProjectService } from './projectService.js';

const projectService = new ProjectService();

export class ProjectController {
  async create(req: Request, res: Response) {
    try {
      const project = await projectService.create(req.body);
      return res.status(201).json(project);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async findByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId || Array.isArray(userId)) {
        return res.status(400).json({ message: 'Invalid userId' });
      }

      const projects = await projectService.findByUser(userId);
      return res.json(projects);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
      }
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
