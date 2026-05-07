export type Status = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type LoginDTO = {
  login: string;
  password: string;
};

export type JwtPayload = {
  userId: string;
};
