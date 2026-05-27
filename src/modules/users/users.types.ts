import type { UserRole } from '../../generated/prisma/enums.js';

export type CreateUserDTO = { name: string; email: string; password: string };

export type UpdateUserDTO = Partial<{ name: string }>;

export type UpdateUserPersistenceDTO = Partial<{ name: string; password: string; deletedAt: Date | null }>;

export type UserResponseDTO = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
};

export type FindUsersFiltersDTO = { page: number; limit: number; emailVerified?: boolean };

export type DeleteUserDTO = { targetUserId: string; authenticatedUserId: string; authenticatedUserRole: UserRole };

export type FindUserWithAuthDTO = {
  targetUserId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
};

export type UpdateUserWithAuthDTO = {
  targetUserId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
  data: UpdateUserDTO;
};

export type UpdatePasswordDTO = { currentPassword: string; newPassword: string };

export type UpdatePasswordWithAuthDTO = { authenticatedUserId: string; data: UpdatePasswordDTO };
