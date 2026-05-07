import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { TaskRepository } from './taskRepository.js';
import { TaskService } from './taskService.js';
import { TaskController } from './taskController.js';
import { ProjectRepository } from '../project/projectRepository.js';

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
router.get('/project/:projectId', taskController.findByProject.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

export default router;
