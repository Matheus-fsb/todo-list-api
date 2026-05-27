import type { IMailService } from '../../shared/mail/mail.service.js';
import type { ProjectResponseDTO } from '../projects/projects.types.js';
import { NotificationService } from './notification.service.js';
import { NotificationType, type NotificationDTO, type NotificationRecipientDTO } from './notification.types.js';

type ProjectNotificationDTO = {
  project: Pick<ProjectResponseDTO, 'name'>;
  user: NotificationRecipientDTO;
};

export interface IProjectNotificationService {
  createProjectCreatedNotification(data: ProjectNotificationDTO): Promise<NotificationDTO>;
  createProjectDeletedNotification(data: ProjectNotificationDTO): Promise<NotificationDTO>;
  createProjectRestoredNotification(data: ProjectNotificationDTO): Promise<NotificationDTO>;
}

export class ProjectNotificationService extends NotificationService implements IProjectNotificationService {
  constructor(mailService: IMailService) {
    super(mailService);
  }

  async createProjectCreatedNotification({ project, user }: ProjectNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Projeto criado: ${project.name}`,
      message: `O projeto "${project.name}" foi criado com sucesso.`,
      notificationType: NotificationType.PROJECT_CREATED,
    });
  }

  async createProjectDeletedNotification({ project, user }: ProjectNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Projeto removido: ${project.name}`,
      message: `O projeto "${project.name}" foi removido.`,
      notificationType: NotificationType.PROJECT_DELETED,
    });
  }

  async createProjectRestoredNotification({ project, user }: ProjectNotificationDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      subject: `Projeto restaurado: ${project.name}`,
      message: `O projeto "${project.name}" foi restaurado.`,
      notificationType: NotificationType.PROJECT_RESTORED,
    });
  }
}
