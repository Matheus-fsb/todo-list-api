import type { Request, Response } from 'express';
import { type IProjectService } from './projects.service.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';

export interface IProjectController {
  create(req: Request, res: Response): Promise<Response>;
  findByUser(req: Request, res: Response): Promise<Response>;
  update(req: AuthenticatedRequest, res: Response): Promise<Response>;
  delete(req: AuthenticatedRequest, res: Response): Promise<Response>;
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

  async update(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const updatedProject = await this.projectService.update({
        targetProjectId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
        data: req.body,
      });
      return res.status(200).json(updatedProject);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (error instanceof Error && error.message === 'Project not found') {
        return res.status(404).json({ message: 'Project not found' });
      }
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      await this.projectService.delete({
        targetProjectId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
      });
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (error instanceof Error && error.message === 'Project not found') {
        return res.status(404).json({ message: 'Project not found' });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
