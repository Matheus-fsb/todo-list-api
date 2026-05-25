import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { TaskRepository } from './tasks.repository.js';
import { TaskService } from './tasks.service.js';
import { TaskController } from './tasks.controller.js';
import { ProjectRepository } from '../projects/projects.repository.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();
const taskController = new DependenceFactory(
  { taskRepository: new TaskRepository(), projectRepository: new ProjectRepository() },
  TaskService,
  TaskController,
).getController();

router.post('/', asyncHandler(taskController.create.bind(taskController)));
router.put('/:id', authMiddleware, asyncHandler(taskController.update.bind(taskController)));
router.get(
  '/projects/:projectId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(taskController.findByProject.bind(taskController)),
);
router.delete('/:id', authMiddleware, asyncHandler(taskController.delete.bind(taskController)));
router.patch('/:id', authMiddleware, asyncHandler(taskController.softDelete.bind(taskController)));

export default router;
