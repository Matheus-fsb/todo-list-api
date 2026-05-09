import type { UserRole } from '../../generated/prisma/client.js';

// Dados para criação de usuário
export type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
};

// Dados para atualização (campos opcionais)
export type UpdateUserDTO = Partial<CreateUserDTO>;

// Dados que serão retornados pela API (sem senha)
export type UserResponseDTO = {
  id: string;
  name: string;
  email: string;
};

export interface DeleteUserDTO {
  targetUserId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
}

export interface UpdateUserWithAuthDTO {
  targetUserId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
  data: UpdateUserDTO;
}