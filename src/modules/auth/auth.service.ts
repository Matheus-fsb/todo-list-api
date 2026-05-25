import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions, type Secret } from 'jsonwebtoken';

import type {
  AuthDependencies,
  AuthResponseDTO,
  AuthUserDTO,
  JwtPayload,
  LoginDTO,
  TokenPairDTO,
} from './auth.types.js';
import { AppError } from '../../errors/AppError.js';

export interface IAuthService {
  login(data: LoginDTO): Promise<AuthResponseDTO>;
  refresh(refreshToken: string): Promise<TokenPairDTO>;
  generateValidationEmailToken(user: AuthUserDTO): Promise<void>;
  validateEmail(token: string): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
}

export class AuthService implements IAuthService {
  constructor(private dependencies: AuthDependencies) {}

  async login(data: LoginDTO): Promise<AuthResponseDTO> {
    const user = await this.dependencies.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AppError('Email or password invalid', 401);
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);

    if (!passwordMatches) {
      throw new AppError('Email or password invalid', 401);
    }

    if (!user.emailVerified) {
      throw new AppError('Email not verified', 403);
    }

    const accessToken = this.generateAccessToken({ sub: user.id, role: user.role });

    const refreshToken = this.generateRefreshToken({ sub: user.id, role: user.role });

    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken, refreshToken };
  }

  async refresh(refreshToken: string): Promise<TokenPairDTO> {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const payload = jwt.verify(refreshToken, secret as Secret) as JwtPayload;

    const user = await this.dependencies.userRepository.findById(payload.sub);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const newAccessToken = this.generateAccessToken({ sub: user.id, role: user.role });

    const newRefreshToken = this.generateRefreshToken({ sub: user.id, role: user.role });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async generateValidationEmailToken(user: AuthUserDTO): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.dependencies.authRepository.create({ token, userId: user.id, expiresAt });

    try {
      await this.dependencies.notificationService.verifyAccountNotification(user, token);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending validation email:', error.message);
      }
    }
  }

  async resendVerificationEmail(email: string): Promise<void> {
    const user = await this.dependencies.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.emailVerified) {
      throw new AppError('Email already verified', 409);
    }

    await this.dependencies.authRepository.deleteByUser(user.id);

    await this.generateValidationEmailToken({ id: user.id, name: user.name, email: user.email, role: user.role });
  }

  async validateEmail(token: string): Promise<void> {
    const validationToken = await this.dependencies.authRepository.findByToken(token);

    if (!validationToken) {
      throw new AppError('Invalid validation token', 400);
    }

    if (validationToken.expiresAt < new Date()) {
      await this.dependencies.authRepository.delete(validationToken.id);
      throw new AppError('Expired validation token', 410);
    }

    await this.dependencies.userRepository.verifyEmail(validationToken.userId);
    await this.dependencies.authRepository.delete(validationToken.id);

    const user = await this.dependencies.userRepository.findById(validationToken.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.dependencies.notificationService.createWelcomeNotification({ name: user.name, email: user.email });
  }

  private generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_ACCESS_SECRET;

    if (!secret) {
      throw new Error('JWT_ACCESS_SECRET is not defined');
    }

    const expiresIn: SignOptions['expiresIn'] =
      (process.env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn']) || '15m';

    return jwt.sign(payload, secret as Secret, { expiresIn });
  }

  private generateRefreshToken(payload: JwtPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET;

    if (!secret) {
      throw new Error('JWT_REFRESH_SECRET is not defined');
    }

    const expiresIn: SignOptions['expiresIn'] =
      (process.env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn']) || '7d';

    return jwt.sign(payload, secret as Secret, { expiresIn });
  }
}
