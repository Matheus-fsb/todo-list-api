import type { IMailService } from '../../shared/mail/mail.service.js';
import type { UserMail } from './notification.types.js';
import { NotificationType, type Notification } from './notification.types.js';

export interface INotificationService {
    createWelcomeNotification(user: UserMail): Promise<Notification>
}

export class NotificationService implements INotificationService{
  constructor(private mailService: IMailService) {}

  async createWelcomeNotification(user: UserMail): Promise<Notification> {
    const notification: Notification = {
      destination: { name: user.name, email: user.email },
      message: `Quero te agradecer por registrar sua conta e ser mais um dos nossos!`,
      subject: `Bem-vindo ao To-Do List, ${user.name}`,
      notificationType: NotificationType.WELCOME_MESSAGE,
    };

    await this.mailService.send({
      to: notification.destination.email,
      subject: notification.subject,
      message: notification.message,
    });

    return notification;
  }
}
