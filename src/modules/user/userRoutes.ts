import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { UserRepository } from './userRepository.js';
import { UserService } from './userService.js';
import { UserController } from './userController.js';

const router = Router();

const userController = new DependenceFactory(
  {
    userRepository: new UserRepository(),
  },
  UserService,
  UserController
).getController();

router.post('/', userController.create.bind(userController));
router.get('/', userController.findAll.bind(userController));
router.delete('/:id', userController.delete.bind(userController));
router.patch('/:id', userController.update.bind(userController));

export default router;