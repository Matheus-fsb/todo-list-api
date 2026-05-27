import { Router } from 'express';

import { asyncHandler } from '../../utils/asyncHandler.js';
import { makeControllers } from '../../shared/factories/controllersFactory.js';

const router = Router();
const { validationTokenController } = makeControllers();

router.get('/verify-email', asyncHandler(validationTokenController.validateEmail.bind(validationTokenController)));
router.post(
  '/resend-verification-token',
  asyncHandler(validationTokenController.resendVerificationEmail.bind(validationTokenController)),
);

export default router;
