import bcrypt from 'bcrypt';
import { describe, expect, it, jest } from '@jest/globals';
import { ZodError } from 'zod';
import { AppError } from '../src/errors/AppError.js';
import { UserService } from '../src/modules/users/users.service.js';

function makeService(overrides: Record<string, unknown> = {}) {
  const userRepository = {
    findById: jest.fn(),
    findByIdWithDeleted: jest.fn(),
    findByEmail: jest.fn(),
    findAll: jest.fn(),
    findDeleted: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    deleteExpiredUnverifiedUsers: jest.fn(),
    ...overrides,
  };

  const service = new UserService({
    userRepository,
    validationTokenService: { generateValidationEmailToken: jest.fn() },
    projectService: { findAllByUser: jest.fn(), softDelete: jest.fn() },
  } as any);

  return { service, userRepository };
}

describe('UserService', () => {
  it('creates public users with the default repository payload, without accepting role input', async () => {
    const { service, userRepository } = makeService({
      findByEmail: jest.fn(async () => null),
      create: jest.fn(async (data: any) => ({
        id: 'user-1',
        name: data.name,
        email: data.email,
        password: data.password,
        role: 'USER',
        emailVerified: false,
        emailVerifiedAt: null,
      })),
    });

    await service.create({
      name: 'Matheus',
      email: 'matheus@example.com',
      password: 'password-10',
      role: 'ADMIN',
    } as any);

    expect(userRepository.create).toHaveBeenCalledWith(
      expect.not.objectContaining({
        role: 'ADMIN',
      }),
    );
  });

  it('does not allow email updates through the general update method', async () => {
    const { service } = makeService();

    await expect(
      service.update({
        targetUserId: 'user-1',
        authenticatedUserId: 'user-1',
        authenticatedUserRole: 'USER',
        data: { email: 'new@example.com' } as any,
      }),
    ).rejects.toBeInstanceOf(ZodError);
  });

  it('updates password only when the current password matches', async () => {
    const storedPassword = await bcrypt.hash('old-password-10', 10);
    const { service, userRepository } = makeService({
      findById: jest.fn(async () => ({ id: 'user-1', password: storedPassword })),
      update: jest.fn(async () => ({ id: 'user-1' })),
    });

    await service.updatePassword({
      authenticatedUserId: 'user-1',
      data: { currentPassword: 'old-password-10', newPassword: 'new-password-10' },
    });

    expect(userRepository.update).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({ password: expect.any(String) }),
    );
    const [, updateData] = (userRepository.update as any).mock.calls[0];
    await expect(bcrypt.compare('new-password-10', updateData.password)).resolves.toBe(true);
  });

  it('rejects password update when the current password is invalid', async () => {
    const storedPassword = await bcrypt.hash('old-password-10', 10);
    const { service } = makeService({
      findById: jest.fn(async () => ({ id: 'user-1', password: storedPassword })),
    });

    await expect(
      service.updatePassword({
        authenticatedUserId: 'user-1',
        data: { currentPassword: 'wrong-password', newPassword: 'new-password-10' },
      }),
    ).rejects.toEqual(expect.objectContaining({ message: 'Current password invalid', statusCode: 401 }));
  });

  it('returns paginated users without password field', async () => {
    const { service } = makeService({
      findAll: jest.fn(async () => ({
        items: [
          {
            id: 'user-1',
            name: 'Matheus',
            email: 'matheus@example.com',
            password: 'hash',
            emailVerified: true,
            emailVerifiedAt: null,
          },
        ],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      })),
    });

    const result = await service.findAll({ page: 1, limit: 10 });

    expect(result.items[0]).toEqual({
      id: 'user-1',
      name: 'Matheus',
      email: 'matheus@example.com',
      emailVerified: true,
      emailVerifiedAt: null,
    });
    expect(result.items[0]).not.toHaveProperty('password');
  });

  it('restores users only for admins', async () => {
    const { service } = makeService({
      findByIdWithDeleted: jest.fn(async () => ({
        id: 'user-1',
        name: 'Matheus',
        email: 'matheus@example.com',
        emailVerified: true,
        emailVerifiedAt: null,
      })),
    });

    await expect(
      service.restore({
        targetUserId: 'user-1',
        authenticatedUserId: 'user-1',
        authenticatedUserRole: 'USER',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
