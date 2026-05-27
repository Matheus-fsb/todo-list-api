import type { IMailService } from '../../shared/mail/mail.service.js';
import { type NotificationDataDTO, type NotificationDTO } from './notification.types.js';

export class NotificationService {
  constructor(protected mailService: IMailService) {}

  protected async sendNotification(data: NotificationDataDTO): Promise<NotificationDTO> {
    const notification: NotificationDTO = {
      destination: { name: data.name, email: data.email },
      message: data.message,
      subject: data.subject,
      notificationType: data.notificationType,
    };

    await this.mailService.send({
      to: notification.destination.email,
      subject: notification.subject,
      message: notification.message,
      html: notification.message,
    });

    return notification;
  }
}
