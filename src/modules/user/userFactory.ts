import { UserController } from './userController.js';
import { UserRepository } from './userRepository.js';
import { UserService } from './userService.js';

export function makeUserController() {
  const repository = new UserRepository();
  const service = new UserService(repository);
  const controller = new UserController(service);

  return controller;
}
