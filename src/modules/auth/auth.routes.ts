import { Router } from 'express';

import { UserRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { authRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

const router = Router();
const authService = new AuthService({ userRepository: new UserRepository() });

const authController = new AuthController(authService);

router.post('/login', authRateLimiter, asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refresh.bind(authController)));
router.post('/logout', authController.logout.bind(authController));

export default router;
