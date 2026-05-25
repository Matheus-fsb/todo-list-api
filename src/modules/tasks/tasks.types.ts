import type { Priority, Status, UserRole } from '../../generated/prisma/enums.js';

export type TaskStatus = Status;
export type TaskPriority = Priority;

export type CreateTaskDTO = {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId: string;
  dueDate?: Date | null;
};

export type UpdateTaskDTO = Partial<{
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: Date | null;
}>;

export type UpdateTaskPersistenceDTO = UpdateTaskDTO & Partial<{ completedAt: Date | null; deletedAt: Date | null }>;

export type TaskResponseDTO = {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
  dueDate: Date | null;
  projectId: string;
};

export type UpdateTaskWithAuthDTO = {
  targetTaskId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
  data: UpdateTaskDTO;
};

export type DeleteTaskWithAuthDTO = {
  targetTaskId: string;
  authenticatedUserId: string;
  authenticatedUserRole: UserRole;
};
