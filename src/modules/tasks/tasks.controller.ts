import type { Request, Response } from 'express';
import type { TaskService } from './tasks.service.js';
import type { AuthenticatedRequest } from '../auth/auth.request.js';

export class TaskController {
  constructor(private taskService: TaskService) {}

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const task = await this.taskService.create(req.body);
      return res.status(201).json(task);
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
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const task = await this.taskService.update({
        targetTaskId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
        data: req.body,
      });
      return res.json(task);
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ message: 'Task not found' });
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

  async findByProject(req: Request, res: Response): Promise<Response> {
    try {
      const { projectId } = req.params;

      if (!projectId || Array.isArray(projectId)) {
        return res.status(400).json({ message: 'Invalid projectId' });
      }

      const tasks = await this.taskService.findByProject(projectId);
      return res.json(tasks);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ message: error.message });
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

      await this.taskService.delete({
        targetTaskId: id,
        authenticatedUserId: req.user.id,
        authenticatedUserRole: req.user.role,
      });
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (error instanceof Error && error.message === 'Task not found') {
        return res.status(404).json({ message: 'Task not found' });
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
}
