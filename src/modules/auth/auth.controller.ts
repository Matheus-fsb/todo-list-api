import type { Request, Response } from 'express';
import type { IAuthService } from './auth.service.js';

export class AuthController {
  constructor(private authService: IAuthService) {}

  async login(req: Request, res: Response): Promise<Response> {
    try {
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

      return res.status(200).json({
        user: result.user,
        message: 'Login successful',
      });
    } catch {
      return res.status(401).json({
        message: 'Login or password invalid',
      });
    }
  }

  async refresh(req: Request, res: Response): Promise<Response> {
    try {
      const refreshToken = req.cookies?.refreshToken;

      if (!refreshToken) {
        return res.status(401).json({
          message: 'Refresh token not found',
        });
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

      return res.status(200).json({
        message: 'Token refreshed successfully',
      });
    } catch {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');

      return res.status(401).json({
        message: 'Invalid refresh token',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<Response> {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      message: 'Logout successful',
    });
  }
}
