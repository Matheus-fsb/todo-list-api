import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { UserRepository } from './users.repository.js';
import { UserService } from './users.service.js';
import { UserController } from './users.controller.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';

const router = Router();

const userController = new DependenceFactory(
  {
    userRepository: new UserRepository(),
  },
  UserService,
  UserController
).getController();

router.post('/', userController.create.bind(userController));
router.get('/', authMiddleware, roleMiddleware(['ADMIN']), userController.findAll.bind(userController));
router.get('/:id', authMiddleware, roleMiddleware(['ADMIN']), userController.findById.bind(userController));
router.delete('/:id', authMiddleware, userController.delete.bind(userController));
router.patch('/:id', authMiddleware, userController.update.bind(userController));

export default router;
