import type { UserRole } from '../../generated/prisma/enums.js';

export type CreateUserDTO = { name: string; email: string; password: string; role?: UserRole };

export type UpdateUserDTO = Partial<{ name: string; email: string; password: string }>;

export type UpdateUserPersistenceDTO = UpdateUserDTO & Partial<{ deletedAt: Date }>;

export type UserResponseDTO = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
};

export type DeleteUserDTO = { targetUserId: string; authenticatedUserId: string; authenticatedUserRole: UserRole };

export type UpdateUserWithAuthDTO = {
  targetUserId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
  data: UpdateUserDTO;
};
