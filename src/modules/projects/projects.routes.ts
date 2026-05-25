import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { ProjectRepository } from './projects.repository.js';
import { UserRepository } from '../users/users.repository.js';
import { ProjectService } from './projects.service.js';
import { ProjectController } from './projects.controller.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { TaskRepository } from '../tasks/tasks.repository.js';
import { TaskService } from '../tasks/tasks.service.js';

const router = Router();
const projectRepository = new ProjectRepository();
const userRepository = new UserRepository();
const taskRepository = new TaskRepository();
const taskService = new TaskService({ taskRepository, projectRepository });

const projectController = new DependenceFactory(
  { projectRepository, userRepository, taskRepository, taskService },
  ProjectService,
  ProjectController,
).getController();

router.post('/', asyncHandler(projectController.create.bind(projectController)));
router.get(
  '/users/:userId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(projectController.findByUser.bind(projectController)),
);
router.patch('/:id', authMiddleware, asyncHandler(projectController.update.bind(projectController)));
router.delete('/:id', authMiddleware, asyncHandler(projectController.delete.bind(projectController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(projectController.softDelete.bind(projectController)));

export default router;
