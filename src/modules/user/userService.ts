import type { CreateUserDTO, UserResponseDTO } from './userTypes.js';
import type { IUserRepository } from './userRepository.js';

export interface IUserService {
  create(data: CreateUserDTO): Promise<UserResponseDTO>;
  findAll(): Promise<UserResponseDTO[]>;
}

export class UserService implements IUserService {
  private userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const userExists = await this.userRepository.findByLogin(data.login);

    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await this.userRepository.create(data);

    return {
      id: user.id,
      name: user.name,
      login: user.login,
    };
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await this.userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      login: user.login,
    }));
  }
}
