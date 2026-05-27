export enum NotificationType {
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  PROJECT_RESTORED = 'PROJECT_RESTORED',
  TASK_CREATED = 'TASK_CREATED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_REOPENED = 'TASK_REOPENED',
  TASK_DUE_TODAY = 'TASK_DUE_TODAY',
  TASK_OVERDUE = 'TASK_OVERDUE',
}

export type NotificationRecipientDTO = { name: string; email: string };

export type NotificationDataDTO = NotificationRecipientDTO & {
  subject: string;
  message: string;
  notificationType: NotificationType;
};

export type NotificationDTO = {
  destination: NotificationRecipientDTO;
  subject: string;
  message: string;
  notificationType: NotificationType;
};
