import bcrypt from 'bcrypt';
import { createUserSchema, updateUserSchema } from './users.schemas.js';

import type {
  CreateUserDTO,
  DeleteUserDTO,
  UpdateUserWithAuthDTO,
  UserResponseDTO,
} from './users.types.js';

import type { IUserRepository } from './users.repository.js';
import type { IAuthService } from '../auth/auth.service.js';

export interface IUserService {
  create(data: CreateUserDTO): Promise<UserResponseDTO>;
  findAll(): Promise<UserResponseDTO[]>;
  delete(data: DeleteUserDTO): Promise<void>;
  update(data: UpdateUserWithAuthDTO): Promise<UserResponseDTO>;
  findById(id: string): Promise<UserResponseDTO>;
}

type Dependencies = {
  userRepository: IUserRepository;
  authService: IAuthService;
};

export class UserService implements IUserService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    createUserSchema.parse(data);

    const userExists = await this.deps.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.deps.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    try {
      await this.deps.authService.generateValidationEmailToken({
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }

  async delete(data: DeleteUserDTO): Promise<void> {
    const isSelfDelete = data.targetUserId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new Error('Forbidden');
    }

    const userExists = await this.deps.userRepository.findById(
      data.targetUserId,
    );

    if (!userExists) {
      throw new Error('User not found');
    }

    await this.deps.userRepository.delete(data.targetUserId);
  }

  async update(data: UpdateUserWithAuthDTO): Promise<UserResponseDTO> {
    updateUserSchema.parse(data.data);

    const isSelfUpdate = data.targetUserId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfUpdate && !isAdmin) {
      throw new Error('Forbidden');
    }

    const userExists = await this.deps.userRepository.findById(
      data.targetUserId,
    );

    if (!userExists) {
      throw new Error('User not found');
    }

    if (data.data.email && data.data.email !== userExists.email) {
      const emailInUse = await this.deps.userRepository.findByEmail(
        data.data.email,
      );

      if (emailInUse) {
        throw new Error('Email already in use');
      }
    }

    const dataToUpdate = { ...data.data };

    if (data.data.password) {
      dataToUpdate.password = await bcrypt.hash(data.data.password, 10);
    }

    const updatedUser = await this.deps.userRepository.update(
      data.targetUserId,
      dataToUpdate,
    );

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      emailVerified: updatedUser.emailVerified,
      emailVerifiedAt: updatedUser.emailVerifiedAt,
    };
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.deps.userRepository.findAll();

    return users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
    }));
  }

  async findById(id: string): Promise<UserResponseDTO> {
    const user = await this.deps.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }
}
