import type { UserRole } from '../../generated/prisma/enums.js';
import type { INotificationService } from '../notifications/notification.service.js';
import type { IAuthRepository } from './auth.repository.js';
import type { IUserRepository } from '../users/users.repository.js';

export type AuthDependencies = {
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
  notificationService: INotificationService;
};

export type LoginDTO = { email: string; password: string };

export type AuthUserDTO = { id: string; name: string; email: string; role: UserRole };

export type AuthResponseUserDTO = { id: string; name: string; email: string; role: UserRole };

export type AuthResponseDTO = { user: AuthResponseUserDTO; accessToken: string; refreshToken: string };

export type TokenPairDTO = { accessToken: string; refreshToken: string };

export type JwtPayload = { sub: string; role: UserRole };

export type AuthenticatedUserDTO = { id: string; role: UserRole };

export type CreateValidationTokenDTO = { token: string; userId: string; expiresAt: Date };

export type UpdateValidationTokenDTO = Partial<{ token: string; expiresAt: Date }>;
