export type Notification = {
  destination: UserMail;
  subject: string;
  message: string;
  notificationType: NotificationType;
};

export enum NotificationType {
  WELCOME_MESSAGE = 'WELCOME_MESSAGE',
  VERIFY_ACCOUNT = 'VERIFY_ACCOUNT',
}

export type UserMail = {
  name: string;
  email: string;
};
