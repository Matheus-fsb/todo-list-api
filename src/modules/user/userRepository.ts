import { prisma } from '../../lib/prisma.js';
import type { User } from '../../generated/prisma/client.js';
import type { CreateUserDTO, UpdateUserDTO } from './userTypes.js';

export class UserRepository {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async findByLogin(login: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { login },
    });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(id: string, data: UpdateUserDTO): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}
