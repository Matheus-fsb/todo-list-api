import type { NextFunction, Request, Response } from 'express';
import type { IAuthService } from './auth.service.js';
import { AppError } from '../../errors/AppError.js';
import { successResponse } from '../../utils/apiResponse.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<Response> {
    const result = await this.authService.login(req.body);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return res.status(200).json(successResponse('Login successful', { user: result.user }));
  }

  async refresh(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        throw new AppError('Refresh token not found', 401);
      }

      const result = await this.authService.refresh(refreshToken);

      res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 15,
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json(successResponse('Token refreshed successfully'));
    } catch (error: unknown) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      if (error instanceof AppError) {
        return next(error);
      }

      return next(new AppError('Invalid refresh token', 401));
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json(successResponse('Logout successful'));
  }

  async validateEmail(req: Request, res: Response): Promise<Response> {
    const { token } = req.query;

    if (typeof token !== 'string') {
      throw new AppError('Validation token is required', 400);
    }

    await this.authService.validateEmail(token);

    return res.status(200).json(successResponse('Email validated successfully'));
  }

  async resendVerificationEmail(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    await this.authService.resendVerificationEmail(email);

    return res.status(200).json(successResponse('Verification email resent successfully'));
  }
}
