export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type DataUser = {
  name: string;
  login: string;
  password: string;
};

export type DataProject = {
  id: string;
  name: string;
  description?: string;
  userId: string;
};

export type DataTask = {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priorit?: Priority;
  completedAt: Date;
  projectId: string;
};

export type LoginDTO = {
  login: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
};
