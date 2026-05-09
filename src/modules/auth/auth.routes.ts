import { Router } from 'express';

import { DependenceFactory } from '../../shared/factories/moduleFactory.js';

import { UserRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authRateLimiter } from '../../middlewares/rate-limit.middleware.js';

const router = Router();

const authFactory = new DependenceFactory(
  {
    userRepository: new UserRepository(),
  },
  AuthService,
  AuthController
);

const authController = authFactory.getController();

router.post('/login', authRateLimiter, authController.login.bind(authController));
router.post('/refresh', authController.refresh.bind(authController));
router.post('/logout', authController.logout.bind(authController));

export default router;