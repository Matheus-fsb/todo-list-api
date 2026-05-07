// DTO para criação
export type CreateProjectDTO = {
  name: string;
  description?: string;
  userId: string;
};

// DTO para update
export type UpdateProjectDTO = Partial<CreateProjectDTO>;

// DTO de resposta
export type ProjectResponseDTO = {
  id: string;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
};
