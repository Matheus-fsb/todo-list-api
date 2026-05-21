import type { UserRole } from '../../generated/prisma/enums.js';
import type { INotificationService } from '../notifications/notification.service.js';
import type { IAuthRepository } from './auth.repository.js';
import type { IUserRepository } from '../users/users.repository.js';

export interface AuthDependencies {
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
  notificationService: INotificationService;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthUserDTO {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export type AuthResponseDTO = {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
};

export interface JwtPayloadDTO {
  sub: string;
  role: UserRole;
}

export interface AuthenticatedUserDTO {
  id: string;
  role: UserRole;
}

export interface CreateTokenDTO {
  token: string;
  userId: string;
  expiresAt: Date;
}
