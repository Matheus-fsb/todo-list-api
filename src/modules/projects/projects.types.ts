// DTO para criação
export type CreateProjectDTO = { name: string; description?: string; userId: string };

// DTO para update
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

export type UpdateProjectWithAuthDTO = {
  targetProjectId: string;
  authenticatedUserId: string;
  authenticatedUserRole: string;
  data: UpdateProjectDTO;
};

export type DeleteProjectWithAuthDTO = {
  targetProjectId: string;
  authenticatedUserId: string;
  authenticatedUserRole: string;
};

// DTO de resposta
export type ProjectResponseDTO = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
