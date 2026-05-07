import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
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
  ProjectController
).getController();

router.post('/', projectController.create.bind(projectController));
router.get('/users/:userId', projectController.findByUser.bind(projectController));
router.patch('/:id', projectController.update.bind(projectController));

export default router;
