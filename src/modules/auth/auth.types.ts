import type { UserRole } from '../../generated/prisma/enums.js';
import type { IUserRepository } from '../users/users.repository.js';

export type AuthDependencies = { userRepository: IUserRepository };

export type LoginDTO = { email: string; password: string };

export type AuthResponseUserDTO = { id: string; name: string; email: string; role: UserRole };

export type AuthResponseDTO = { user: AuthResponseUserDTO; accessToken: string; refreshToken: string };

export type TokenPairDTO = { accessToken: string; refreshToken: string };

export type JwtPayload = { sub: string; role: UserRole };

export type AuthenticatedUserDTO = { id: string; role: UserRole };
