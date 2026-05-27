import type { IMailService } from '../../shared/mail/mail.service.js';
import { NotificationService } from './notification.service.js';
import { NotificationType, type NotificationDTO, type NotificationRecipientDTO } from './notification.types.js';

export interface IUserNotificationService {
  createWelcomeNotification(user: NotificationRecipientDTO): Promise<NotificationDTO>;
  verifyAccountNotification(user: NotificationRecipientDTO, token: string): Promise<NotificationDTO>;
}

export class UserNotificationService extends NotificationService implements IUserNotificationService {
  constructor(mailService: IMailService) {
    super(mailService);
  }

  async verifyAccountNotification(user: NotificationRecipientDTO, token: string): Promise<NotificationDTO> {
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

    return this.sendNotification({
      name: user.name,
      email: user.email,
      message: html,
      subject: `Verificação de Email de ${user.name}`,
      notificationType: NotificationType.VERIFY_ACCOUNT,
    });
  }

  async createWelcomeNotification(user: NotificationRecipientDTO): Promise<NotificationDTO> {
    return this.sendNotification({
      name: user.name,
      email: user.email,
      message: 'Quero te agradecer por registrar sua conta e ser mais um dos nossos!',
      subject: `Bem-vindo ao To-Do List, ${user.name}`,
      notificationType: NotificationType.WELCOME_MESSAGE,
    });
  }
}
