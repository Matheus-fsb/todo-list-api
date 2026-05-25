import type { IMailService } from '../../shared/mail/mail.service.js';
import type { UserMail } from './notification.types.js';
import { NotificationType, type Notification } from './notification.types.js';

export interface INotificationService {
  createWelcomeNotification(user: UserMail): Promise<Notification>;
  verifyAccountNotification(user: UserMail, token: string): Promise<Notification>;
}

export class NotificationService implements INotificationService {
  constructor(private mailService: IMailService) {}

  async verifyAccountNotification(user: UserMail, token: string): Promise<Notification> {
    const verificationUrl = `${process.env.APP_URL}/auth/verify-email?token=${encodeURIComponent(token)}`;

    const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Verificação de e-mail</h2>

      <p>Olá, ${user.name}.</p>

      <p>Clique no botão abaixo para verificar sua conta:</p>

      <a 
        href="${verificationUrl}"
        style="
          display: inline-block;
          padding: 12px 20px;
          background-color: #2563eb;
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
        "
      >
        Verificar conta
      </a>

      <p>Se você não criou essa conta, ignore este e-mail.</p>
    </div>
  `;

    const notification: Notification = {
      destination: { name: user.name, email: user.email },
      message: html,
      subject: `Verificação de Email de ${user.name}`,
      notificationType: NotificationType.VERIFY_ACCOUNT,
    };

    await this.mailService.send({
      to: notification.destination.email,
      subject: notification.subject,
      message: notification.message,
      html: notification.message,
    });

    return notification;
  }

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
