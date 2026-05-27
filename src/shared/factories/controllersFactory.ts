import { AuthController } from '../../modules/auth/auth.controller.js';
import { ProjectController } from '../../modules/projects/projects.controller.js';
import { TaskController } from '../../modules/tasks/tasks.controller.js';
import { UserController } from '../../modules/users/users.controller.js';
import { ValidationTokenController } from '../../modules/validation-token/validation-token.controller.js';
import { makeServices } from './servicesFactory.js';

function createControllers() {
  const services = makeServices();

  return {
    authController: new AuthController(services.authService),
    projectController: new ProjectController(services.projectService),
    taskController: new TaskController(services.taskService),
    userController: new UserController(services.userService),
    validationTokenController: new ValidationTokenController(services.validationTokenService),
  };
}

type Controllers = ReturnType<typeof createControllers>;

let controllers: Controllers | null = null;

export function makeControllers(): Controllers {
  controllers ??= createControllers();

  return controllers;
}
