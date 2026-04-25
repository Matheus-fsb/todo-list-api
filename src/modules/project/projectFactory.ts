import { ProjectRepository } from './projectRepository.js';
import { UserRepository } from '../user/userRepository.js';

import { ProjectService } from './projectService.js';
import { ProjectController } from './projectController.js';

export function makeProjectController() {
  const projectRepository = new ProjectRepository();
  const userRepository = new UserRepository();

  const projectService = new ProjectService(projectRepository, userRepository);

  return new ProjectController(projectService);
}
