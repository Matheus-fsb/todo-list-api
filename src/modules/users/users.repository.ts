import { prisma } from '../../lib/prisma.js';
import type { User } from '../../generated/prisma/client.js';
import type { CreateUserDTO, FindUsersFiltersDTO, UpdateUserDTO, UpdateUserPersistenceDTO } from './users.types.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';

export interface IUserRepository {
  create(data: CreateUserDTO): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByIdWithDeleted(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<User>>;
  findDeleted(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<User>>;
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

  async findByIdWithDeleted(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({ where: { email, deletedAt: null } });
  }

  async findAll(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<User>> {
    const skip = (filters.page - 1) * filters.limit;
    const where = {
      deletedAt: null,
      ...(filters.emailVerified !== undefined && { emailVerified: filters.emailVerified }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: filters.limit, orderBy: { createdAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
  }

  async findDeleted(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<User>> {
    const skip = (filters.page - 1) * filters.limit;
    const where = {
      deletedAt: { not: null },
      ...(filters.emailVerified !== undefined && { emailVerified: filters.emailVerified }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take: filters.limit, orderBy: { deletedAt: 'desc' } }),
      prisma.user.count({ where }),
    ]);

    return {
      items: users,
      pagination: { page: filters.page, limit: filters.limit, total, totalPages: Math.ceil(total / filters.limit) },
    };
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
