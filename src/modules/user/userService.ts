import { UserRepository } from './userRepository.js';
import type { CreateUserDTO, UserResponseDTO } from './userTypes.js';

const userRepository = new UserRepository();

export class UserService {
  async create(data: CreateUserDTO): Promise<UserResponseDTO> {
    const userExists = await userRepository.findByLogin(data.login);

    if (userExists) {
      throw new Error('User already exists');
    }

    const user = await userRepository.create(data);

    return {
      id: user.id,
      name: user.name,
      login: user.login,
    };
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const users = await userRepository.findAll();

    return users.map(user => ({
      id: user.id,
      name: user.name,
      login: user.login,
    }));
  }
}
