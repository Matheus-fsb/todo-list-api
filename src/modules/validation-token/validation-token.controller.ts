import type { Request, Response } from 'express';

import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';
import type { IValidationTokenService } from './validation-token.service.js';

export class ValidationTokenController {
  constructor(private validationTokenService: IValidationTokenService) {}

  async validateEmail(req: Request, res: Response): Promise<Response> {
    const { token } = req.query;

    if (typeof token !== 'string') {
      throw new AppError('Validation token is required', 400);
    }

    await this.validationTokenService.validateEmail(token);

    return res.status(200).json(successResponse('Email validated successfully'));
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    await this.validationTokenService.resendVerificationEmail(email);

    return res.status(200).json(successResponse('Verification email resent successfully'));
  }
}
