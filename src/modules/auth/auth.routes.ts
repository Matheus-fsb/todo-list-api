import { Router } from 'express';

import { DependenceFactory } from '../../shared/factories/moduleFactory.js';

import { UserRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { AuthRepository } from './auth.repository.js';
import { NotificationService } from '../notifications/notification.service.js';
import { makeMailService } from '../../shared/mail/mail.factory.js';

const router = Router();

const authFactory = new DependenceFactory(
  {
    userRepository: new UserRepository(),
    authRepository: new AuthRepository(),
    notificationService: new NotificationService(makeMailService()),
  },
  AuthService,
  AuthController,
);

const authController = authFactory.getController();

router.post(
  '/login',
  authRateLimiter,
  authController.login.bind(authController),
);
router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));
router.get('/verify-email', authController.validateEmail.bind(authController));

export default router;
