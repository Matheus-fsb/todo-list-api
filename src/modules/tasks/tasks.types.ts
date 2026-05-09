export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

// DTO para criação
export type CreateTaskDTO = {
  title: string;
  description?: string;
  status?: TaskStatus; // opcional porque tem default
  priority?: TaskPriority;
  projectId: string;
};

// DTO para update
export type UpdateTaskDTO = Partial<{
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  completedAt: Date | null;
}>;

export type UpdateTaskWithAuthDTO = {
  targetTaskId: string;
  authenticatedUserId: string;
  authenticatedUserRole: string;
  data: UpdateTaskDTO;
};

export type DeleteTaskWithAuthDTO = {
  targetTaskId: string;
  authenticatedUserId: string;
  authenticatedUserRole: string;
};

// DTO de resposta
export type TaskResponseDTO = {
  id: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority?: TaskPriority | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date | null;
  projectId: string;
};
