import { AuthService } from '../../modules/auth/auth.service.js';
import { NotificationService } from '../../modules/notifications/notification.service.js';
import { ProjectNotificationService } from '../../modules/notifications/notification-project.service.js';
import { TaskNotificationService } from '../../modules/notifications/notification-task.service.js';
import { UserNotificationService } from '../../modules/notifications/notification-user.service.js';
import { ProjectRepository } from '../../modules/projects/projects.repository.js';
import { ProjectService } from '../../modules/projects/projects.service.js';
import { TaskRepository } from '../../modules/tasks/tasks.repository.js';
import { TaskService } from '../../modules/tasks/tasks.service.js';
import { UserRepository } from '../../modules/users/users.repository.js';
import { UserService } from '../../modules/users/users.service.js';
import { ValidationTokenRepository } from '../../modules/validation-token/validation-token.repository.js';
import { ValidationTokenService } from '../../modules/validation-token/validation-token.service.js';
import { makeMailService } from '../mail/mail.factory.js';

export function makeServices() {
  const userRepository = new UserRepository();
  const projectRepository = new ProjectRepository();
  const taskRepository = new TaskRepository();
  const validationTokenRepository = new ValidationTokenRepository();
  const mailService = makeMailService();
  const notificationService = new NotificationService(mailService);
  const userNotificationService = new UserNotificationService(mailService);
  const taskNotificationService = new TaskNotificationService(mailService);
  const projectNotificationService = new ProjectNotificationService(mailService);

  const taskService = new TaskService({
    taskRepository,
    projectRepository,
    userRepository,
    taskNotificationService,
  });
  const projectService = new ProjectService({
    projectRepository,
    userRepository,
    taskRepository,
    taskService,
    projectNotificationService,
  });
  const validationTokenService = new ValidationTokenService({
    userRepository,
    validationTokenRepository,
    userNotificationService,
  });
  const userService = new UserService({ userRepository, validationTokenService, projectService });
  const authService = new AuthService({ userRepository });

  return {
    userRepository,
    projectRepository,
    taskRepository,
    validationTokenRepository,
    notificationService,
    userNotificationService,
    taskNotificationService,
    projectNotificationService,
    taskService,
    projectService,
    validationTokenService,
    userService,
    authService,
  };
}
