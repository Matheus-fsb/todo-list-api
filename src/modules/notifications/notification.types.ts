export enum NotificationType {
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
}

export type NotificationRecipientDTO = { name: string; email: string };

export type NotificationDTO = {
  destination: NotificationRecipientDTO;
  subject: string;
  message: string;
  notificationType: NotificationType;
};
