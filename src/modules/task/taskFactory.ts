import { TaskRepository } from './taskRepository.js';
import { ProjectRepository } from '../project/projectRepository.js';

import { TaskService } from './taskService.js';
import { TaskController } from './taskController.js';

export function makeTaskController() {
  const taskRepository = new TaskRepository();
  const projectRepository = new ProjectRepository();

  const service = new TaskService(taskRepository, projectRepository);
  const controller = new TaskController(service);

  return controller;
}
