import type { IMailService } from '../../shared/mail/mail.service.js';
import type { TaskResponseDTO } from '../tasks/tasks.types.js';
import { NotificationService } from './notification.service.js';
import { NotificationType, type NotificationDTO, type NotificationRecipientDTO } from './notification.types.js';

type TaskNotificationDTO = {
  task: Pick<TaskResponseDTO, 'title' | 'dueDate'>;
  user: NotificationRecipientDTO;
};

export interface ITaskNotificationService {
  createTaskCreatedNotification(data: TaskNotificationDTO): Promise<NotificationDTO>;
  createTaskCompletedNotification(data: TaskNotificationDTO): Promise<NotificationDTO>;
  createTaskReopenedNotification(data: TaskNotificationDTO): Promise<NotificationDTO>;
  createTaskDueTodayNotification(data: TaskNotificationDTO): Promise<NotificationDTO>;
  createTaskOverdueNotification(data: TaskNotificationDTO): Promise<NotificationDTO>;
}

export class TaskNotificationService extends NotificationService implements ITaskNotificationService {
  constructor(mailService: IMailService) {
    super(mailService);
  }

  async createTaskCreatedNotification({ task, user }: TaskNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Nova tarefa criada: ${task.title}`,
      message: `A tarefa "${task.title}" foi criada com sucesso.`,
      notificationType: NotificationType.TASK_CREATED,
    });
  }

  async createTaskCompletedNotification({ task, user }: TaskNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Tarefa concluída: ${task.title}`,
      message: `A tarefa "${task.title}" foi marcada como concluída.`,
      notificationType: NotificationType.TASK_COMPLETED,
    });
  }

  async createTaskReopenedNotification({ task, user }: TaskNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Tarefa reaberta: ${task.title}`,
      message: `A tarefa "${task.title}" foi reaberta.`,
      notificationType: NotificationType.TASK_REOPENED,
    });
  }

  async createTaskDueTodayNotification({ task, user }: TaskNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Tarefa vence hoje: ${task.title}`,
      message: `A tarefa "${task.title}" vence hoje.`,
      notificationType: NotificationType.TASK_DUE_TODAY,
    });
  }

  async createTaskOverdueNotification({ task, user }: TaskNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Tarefa atrasada: ${task.title}`,
      message: `A tarefa "${task.title}" está atrasada.`,
      notificationType: NotificationType.TASK_OVERDUE,
    });
  }
}
