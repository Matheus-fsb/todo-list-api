import bcrypt from 'bcrypt';
import { createUserSchema, updateUserSchema } from './users.schemas.js';

import type {
  CreateUserDTO,
  DeleteUserDTO,
  UpdateUserWithAuthDTO,
  UserResponseDTO,
} from './users.types.js';

import type { IUserRepository } from './users.repository.js';

export interface IUserService {
  create(data: CreateUserDTO): Promise<UserResponseDTO>;
  findAll(): Promise<UserResponseDTO[]>;
  delete(data: DeleteUserDTO): Promise<void>;
  update(data: UpdateUserWithAuthDTO): Promise<UserResponseDTO>;
  findById(id: string): Promise<UserResponseDTO>;
}

type Dependencies = {
  userRepository: IUserRepository;
};

export class UserService implements IUserService {
  constructor(private deps: Dependencies) {}

  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    createUserSchema.parse(data);

    const userExists = await this.deps.userRepository.findByLogin(data.login);

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.deps.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      login: user.login,
    };
  }

  async delete(data: DeleteUserDTO): Promise<void> {
    const isSelfDelete = data.targetUserId === data.authenticatedUserId;
    const isAdmin = data.authenticatedUserRole === 'ADMIN';

    if (!isSelfDelete && !isAdmin) {
      throw new Error('Forbidden');
    }

    const userExists = await this.deps.userRepository.findById(
      data.targetUserId
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
      data.targetUserId
    );

    if (!userExists) {
      throw new Error('User not found');
    }

    if (data.data.login && data.data.login !== userExists.login) {
      const loginInUse = await this.deps.userRepository.findByLogin(
        data.data.login
      );

      if (loginInUse) {
        throw new Error('Login already in use');
      }
    }

    const dataToUpdate = { ...data.data };

    if (data.data.password) {
      dataToUpdate.password = await bcrypt.hash(data.data.password, 10);
    }

    const updatedUser = await this.deps.userRepository.update(
      data.targetUserId,
      dataToUpdate
    );

    return {
      id: updatedUser.id,
      name: updatedUser.name,
      login: updatedUser.login,
    };
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.deps.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      login: user.login,
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
      login: user.login,
    };
  }
}
