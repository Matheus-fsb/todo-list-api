import { prisma } from '../../lib/prisma.js';
import type { User } from '../../generated/prisma/client.js';
import type { CreateUserDTO, UpdateUserDTO, UpdateUserPersistenceDTO } from './users.types.js';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(): Promise<User[]>;
  update(id: string, data: UpdateUserPersistenceDTO): Promise<User>;
  verifyEmail(id: string): Promise<User>;
  delete(id: string): Promise<User>;
  deleteExpiredUnverifiedUsers(expiresBefore: Date): Promise<{ count: number }>;
}

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { id, deletedAt: null } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany({ where: { deletedAt: null } });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }

  async verifyEmail(id: string): Promise<User> {
    return prisma.user.update({ where: { id }, data: { emailVerified: true, emailVerifiedAt: new Date() } });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } });
  }

  async deleteExpiredUnverifiedUsers(expiresBefore: Date): Promise<{ count: number }> {
    return prisma.user.deleteMany({ where: { emailVerified: false, createdAt: { lte: expiresBefore } } });
  }
}
