import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { AuthService } from '../auth/auth.service.js';
import { AuthRepository } from '../auth/auth.repository.js';
import { NotificationService } from '../notifications/notification.service.js';
import { makeMailService } from '../../shared/mail/mail.factory.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();
const userRepository = new UserRepository();
const notificationService = new NotificationService(makeMailService());
const authService = new AuthService({ userRepository, authRepository: new AuthRepository(), notificationService });

const userController = new DependenceFactory(
  { userRepository, authService },
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

export default router;
