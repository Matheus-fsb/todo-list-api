import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { TaskRepository } from './tasks.repository.js';
import { TaskService } from './tasks.service.js';
import { TaskController } from './tasks.controller.js';
import { ProjectRepository } from '../projects/projects.repository.js';

const router = Router();
const taskController = new DependenceFactory(
  {
    taskRepository: new TaskRepository(),
    projectRepository: new ProjectRepository(),
  },
  TaskService,
  TaskController
).getController();

router.post('/', taskController.create.bind(taskController));
router.put('/:id', taskController.update.bind(taskController));
router.get('/projects/:projectId', taskController.findByProject.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

export default router;
