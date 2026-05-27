import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { ValidationTokenRepository } from '../validation-token/validation-token.repository.js';
import { ValidationTokenService } from '../validation-token/validation-token.service.js';
import { NotificationService } from '../notifications/notification.service.js';
import { makeMailService } from '../../shared/mail/mail.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ProjectService } from '../projects/projects.service.js';
import { ProjectRepository } from '../projects/projects.repository.js';
import { TaskRepository } from '../tasks/tasks.repository.js';
import { TaskService } from '../tasks/tasks.service.js';

const router = Router();
const userRepository = new UserRepository();
const projectRepository = new ProjectRepository();
const taskRepository = new TaskRepository();
const taskService = new TaskService({ taskRepository, projectRepository });
const projectService = new ProjectService({ projectRepository, userRepository, taskRepository, taskService });
const notificationService = new NotificationService(makeMailService());
const validationTokenService = new ValidationTokenService({
  userRepository,
  validationTokenRepository: new ValidationTokenRepository(),
  notificationService,
});

const userController = new DependenceFactory(
  { userRepository, validationTokenService, projectService },
  UserService,
  UserController,
).getController();

router.post('/', asyncHandler(userController.create.bind(userController)));
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), asyncHandler(userController.findAll.bind(userController)));
router.get(
  '/:id',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  asyncHandler(userController.findById.bind(userController)),
);
router.delete('/:id', authMiddleware, asyncHandler(userController.delete.bind(userController)));
router.patch('/:id', authMiddleware, asyncHandler(userController.update.bind(userController)));
router.patch('/:id/soft-delete', authMiddleware, asyncHandler(userController.softDelete.bind(userController)));

export default router;
