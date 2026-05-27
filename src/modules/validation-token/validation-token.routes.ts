import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeMailService } from '../../shared/mail/mail.factory.js';
import { NotificationService } from '../notifications/notification.service.js';
import { UserRepository } from '../users/users.repository.js';
import { ValidationTokenController } from './validation-token.controller.js';
import { ValidationTokenRepository } from './validation-token.repository.js';
import { ValidationTokenService } from './validation-token.service.js';

const router = Router();

const validationTokenService = new ValidationTokenService({
  userRepository: new UserRepository(),
  validationTokenRepository: new ValidationTokenRepository(),
  notificationService: new NotificationService(makeMailService()),
});

const validationTokenController = new ValidationTokenController(validationTokenService);

router.get('/verify-email', asyncHandler(validationTokenController.validateEmail.bind(validationTokenController)));
router.post(
  '/resend-verification-token',
  asyncHandler(validationTokenController.resendVerificationEmail.bind(validationTokenController)),
);

export default router;
