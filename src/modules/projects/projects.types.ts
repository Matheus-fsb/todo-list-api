import type { UserRole } from '../../generated/prisma/enums.js';

export type CreateProjectDTO = { name: string; description?: string; userId: string };

export type CreateProjectWithAuthDTO = { authenticatedUserId: string; data: Omit<CreateProjectDTO, 'userId'> };

export type UpdateProjectDTO = Partial<{ name: string; description: string }>;

export type UpdateProjectPersistenceDTO = UpdateProjectDTO & Partial<{ deletedAt: Date | null }>;

export type ProjectResponseDTO = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};

export type UpdateProjectWithAuthDTO = {
  targetProjectId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
  data: UpdateProjectDTO;
};

export type DeleteProjectWithAuthDTO = {
  targetProjectId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
};

export type FindProjectWithAuthDTO = {
  targetProjectId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
};

export type FindProjectsFiltersDTO = { page: number; limit: number };
