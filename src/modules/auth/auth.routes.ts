import { Router } from 'express';

import { authRateLimiter } from '../../middlewares/rate-limit.middleware.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { authController } = makeControllers();

router.post('/login', authRateLimiter, asyncHandler(authController.login.bind(authController)));
router.post('/refresh', asyncHandler(authController.refresh.bind(authController)));
router.post('/logout', authController.logout.bind(authController));

export default router;
