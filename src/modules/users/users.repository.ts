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
}

export class UserRepository implements IUserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
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
}
