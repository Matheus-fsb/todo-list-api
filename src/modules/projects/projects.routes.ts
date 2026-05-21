import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { authMiddleware } from '../../middlewares/auth.middleware.js';
import { roleMiddleware } from '../../middlewares/role.middleware.js';
import { ProjectRepository } from './projects.repository.js';
import { UserRepository } from '../users/users.repository.js';
import { ProjectService } from './projects.service.js';
import { ProjectController } from './projects.controller.js';

const router = Router();
const projectController = new DependenceFactory(
  {
    projectRepository: new ProjectRepository(),
    userRepository: new UserRepository(),
  },
  ProjectService,
  ProjectController,
).getController();

router.post('/', projectController.create.bind(projectController));
router.get(
  '/users/:userId',
  authMiddleware,
  roleMiddleware(['ADMIN']),
  projectController.findByUser.bind(projectController),
);
router.patch(
  '/:id',
  authMiddleware,
  projectController.update.bind(projectController),
);
router.delete(
  '/:id',
  authMiddleware,
  projectController.delete.bind(projectController),
);

export default router;
