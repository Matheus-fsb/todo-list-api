import bcrypt from 'bcrypt';
import { AppError } from '../../errors/AppError.js';
import { createUserSchema, updatePasswordSchema, updateUserSchema } from './users.schemas.js';

import type {
  CreateUserDTO,
  DeleteUserDTO,
  FindUserWithAuthDTO,
  FindUsersFiltersDTO,
  UpdatePasswordWithAuthDTO,
  UpdateUserPersistenceDTO,
  UpdateUserWithAuthDTO,
  UserResponseDTO,
} from './users.types.js';

import type { IUserRepository } from './users.repository.js';
import type { IValidationTokenService } from '../validation-token/validation-token.service.js';
import type { ProjectService } from '../projects/projects.service.js';
import type { PaginatedResponse } from '../../shared/types/pagination.types.js';

export interface IUserService {
  create(data: CreateUserDTO): Promise<UserResponseDTO>;
  findAll(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<UserResponseDTO>>;
  findDeleted(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<UserResponseDTO>>;
  delete(data: DeleteUserDTO): Promise<void>;
  update(data: UpdateUserWithAuthDTO): Promise<UserResponseDTO>;
  updatePassword(data: UpdatePasswordWithAuthDTO): Promise<void>;
  findById(id: string): Promise<UserResponseDTO>;
  findWithAuth(data: FindUserWithAuthDTO): Promise<UserResponseDTO>;
  softDelete(data: DeleteUserDTO): Promise<void>;
  restore(data: FindUserWithAuthDTO): Promise<UserResponseDTO>;
  deleteExpiredUnverifiedUsers(): Promise<{ count: number }>;
}

type Dependencies = {
  userRepository: IUserRepository;
  validationTokenService: IValidationTokenService;
  projectService: ProjectService;
};

function removeUndefinedFields<T extends object>(data: T): T {
  return Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined)) as T;
}

export class UserService implements IUserService {
  constructor(private deps: Dependencies) {}

  private toResponse(user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    emailVerifiedAt: Date | null;
  }): UserResponseDTO {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }

  private toPaginatedResponse<T extends Parameters<UserService['toResponse']>[0]>(
    result: PaginatedResponse<T>,
  ): PaginatedResponse<UserResponseDTO> {
    return { items: result.items.map((user) => this.toResponse(user)), pagination: result.pagination };
  }

  private async ensureUserAccess(data: FindUserWithAuthDTO, includeDeleted = false) {
    const user = includeDeleted
      ? await this.deps.userRepository.findByIdWithDeleted(data.targetUserId)
      : await this.deps.userRepository.findById(data.targetUserId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const isSelf = data.targetUserId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelf && !isAdmin) {
      throw new AppError('Forbidden', 403);
    }

    return user;
  }

  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    createUserSchema.parse(data);

    const userExists = await this.deps.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.deps.userRepository.create({ ...data, password: hashedPassword });

    try {
      await this.deps.validationTokenService.generateValidationEmailToken({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error sending validation email:', error.message);
      }
    }

    return this.toResponse(user);
  }

  async delete(data: DeleteUserDTO): Promise<void> {
    await this.ensureUserAccess(data);

    await this.deps.userRepository.delete(data.targetUserId);
  }

  async update(data: UpdateUserWithAuthDTO): Promise<UserResponseDTO> {
    const parsedData = removeUndefinedFields(updateUserSchema.parse(data.data)) as UpdateUserPersistenceDTO;

    await this.ensureUserAccess(data);

    const updatedUser = await this.deps.userRepository.update(data.targetUserId, parsedData);

    return this.toResponse(updatedUser);
  }

  async updatePassword(data: UpdatePasswordWithAuthDTO): Promise<void> {
    const parsedData = updatePasswordSchema.parse(data.data);
    const user = await this.deps.userRepository.findById(data.authenticatedUserId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const passwordMatches = await bcrypt.compare(parsedData.currentPassword, user.password);

    if (!passwordMatches) {
      throw new AppError('Current password invalid', 401);
    }

    const hashedPassword = await bcrypt.hash(parsedData.newPassword, 10);

    await this.deps.userRepository.update(data.authenticatedUserId, { password: hashedPassword });
  }

  async findAll(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<UserResponseDTO>> {
    const users = await this.deps.userRepository.findAll(filters);

    return this.toPaginatedResponse(users);
  }

  async findDeleted(filters: FindUsersFiltersDTO): Promise<PaginatedResponse<UserResponseDTO>> {
    const users = await this.deps.userRepository.findDeleted(filters);

    return this.toPaginatedResponse(users);
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.deps.userRepository.findById(id);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return this.toResponse(user);
  }

  async findWithAuth(data: FindUserWithAuthDTO): Promise<UserResponseDTO> {
    const user = await this.ensureUserAccess(data);

    return this.toResponse(user);
  }

  async softDelete(data: DeleteUserDTO): Promise<void> {
    await this.ensureUserAccess(data);

    const projects = await this.deps.projectService.findAllByUser(data.targetUserId);

    for (const project of projects) {
      await this.deps.projectService.softDelete({
        targetProjectId: project.id,
        authenticatedUserId: data.authenticatedUserId,
        authenticatedUserRole: data.authenticatedUserRole,
      });
    }

    await this.deps.userRepository.update(data.targetUserId, { deletedAt: new Date() });
  }

  async restore(data: FindUserWithAuthDTO): Promise<UserResponseDTO> {
    const user = await this.ensureUserAccess(data, true);

    if (data.authenticatedUserRole !== 'ADMIN') {
      throw new AppError('Forbidden', 403);
    }

    const restoredUser = await this.deps.userRepository.update(user.id, { deletedAt: null });

    return this.toResponse(restoredUser);
  }

  async deleteExpiredUnverifiedUsers(): Promise<{ count: number }> {
    const expiresBefore = new Date();
    expiresBefore.setDate(expiresBefore.getDate() - 30);

    return this.deps.userRepository.deleteExpiredUnverifiedUsers(expiresBefore);
  }
}
