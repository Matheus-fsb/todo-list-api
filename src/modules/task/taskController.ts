import type { Request, Response } from 'express';
import type { TaskService } from './taskService.js';

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

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      const task = await this.taskService.update(id, req.body);
      return res.json(task);
    } catch (error: unknown) {
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

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      if (!id || Array.isArray(id)) {
        return res.status(400).json({ message: 'Invalid id' });
      }

      await this.taskService.delete(id);
      return res.status(204).send();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(400).json({ message: error.message });
      }

      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
