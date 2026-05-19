export type Notification = {
    destination: UserMail;
    subject: string;
    message: string;
    notificationType: NotificationType;
}

export enum NotificationType{
    WELCOME_MESSAGE = "WELCOME_MESSAGE",
}

export type UserMail = {
  name: string;
  email: string;
}