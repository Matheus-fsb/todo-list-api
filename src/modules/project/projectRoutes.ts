import { Router } from 'express';
import { DependenceFactory } from '../../shared/factories/moduleFactory.js';
import { ProjectRepository } from './projectRepository.js';
import { UserRepository } from '../user/userRepository.js';
import { ProjectService } from './projectService.js';
import { ProjectController } from './projectController.js';

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
router.get('/user/:userId', projectController.findByUser.bind(projectController));

export default router;
