import type { UserRole } from "../../generated/prisma/enums.js";
import type { IUserRepository } from '../users/users.repository.js';

export interface AuthDependencies {
  userRepository: IUserRepository;
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