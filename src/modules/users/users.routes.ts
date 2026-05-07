import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';

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
router.get('/:id', userController.findById.bind(userController));
router.delete('/:id', userController.delete.bind(userController));
router.patch('/:id', userController.update.bind(userController));

export default router;
