import type { ValidationToken } from '../../generated/prisma/client.js';
import { prisma } from '../../lib/prisma.js';
import type { CreateTokenDTO } from './auth.types.js';

export interface IAuthRepository {
  create(data: CreateTokenDTO): Promise<ValidationToken>;
  delete(id: string): Promise<ValidationToken>;
  findByUser(userId: string): Promise<ValidationToken[]>;
  findById(id: string): Promise<ValidationToken | null>;
  findByToken(token: string): Promise<ValidationToken | null>;
}

export class AuthRepository implements IAuthRepository {
  async create(data: CreateTokenDTO): Promise<ValidationToken> {
    return prisma.validationToken.create({ data });
  }

  async delete(id: string): Promise<ValidationToken> {
    return prisma.validationToken.delete({
      where: { id },
    });
  }

  async findByUser(userId: string): Promise<ValidationToken[]> {
    return prisma.validationToken.findMany({
      where: { userId },
    });
  }

  async findById(id: string): Promise<ValidationToken | null> {
    return prisma.validationToken.findUnique({
      where: { id },
    });
  }

  async findByToken(token: string): Promise<ValidationToken | null> {
    return prisma.validationToken.findUnique({
      where: { token },
    });
  }
}
