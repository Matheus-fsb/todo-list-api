import crypto from 'node:crypto';

import { AppError } from '../../errors/AppError.js';
import type { INotificationService } from '../notifications/notification.service.js';
import type { IUserRepository } from '../users/users.repository.js';
import type { IValidationTokenRepository } from './validation-token.repository.js';
import type { ValidationEmailUserDTO } from './validation-token.types.js';

export interface IValidationTokenService {
  generateValidationEmailToken(user: ValidationEmailUserDTO): Promise<void>;
  resendVerificationEmail(email: string): Promise<void>;
  validateEmail(token: string): Promise<void>;
  deleteExpiredTokens(): Promise<{ count: number }>;
}

type ValidationTokenDependencies = {
  userRepository: IUserRepository;
  validationTokenRepository: IValidationTokenRepository;
  notificationService: INotificationService;
};

export class ValidationTokenService implements IValidationTokenService {
  constructor(private dependencies: ValidationTokenDependencies) {}

  async generateValidationEmailToken(user: ValidationEmailUserDTO): Promise<void> {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await this.dependencies.validationTokenRepository.create({ token, userId: user.id, expiresAt });

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

    await this.dependencies.validationTokenRepository.deleteByUser(user.id);

    await this.generateValidationEmailToken({ id: user.id, name: user.name, email: user.email, role: user.role });
  }

  async validateEmail(token: string): Promise<void> {
    const validationToken = await this.dependencies.validationTokenRepository.findByToken(token);

    if (!validationToken) {
      throw new AppError('Invalid validation token', 400);
    }

    if (validationToken.expiresAt < new Date()) {
      await this.dependencies.validationTokenRepository.delete(validationToken.id);
      throw new AppError('Expired validation token', 410);
    }

    await this.dependencies.userRepository.verifyEmail(validationToken.userId);
    await this.dependencies.validationTokenRepository.delete(validationToken.id);

    const user = await this.dependencies.userRepository.findById(validationToken.userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.dependencies.notificationService.createWelcomeNotification({ name: user.name, email: user.email });
  }

  async deleteExpiredTokens(): Promise<{ count: number }> {
    const result = await this.dependencies.validationTokenRepository.deleteExpired();

    if (result.count === 0) {
      return { count: 0 };
    }

    return { count: result.count };
  }
}
