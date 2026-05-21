import { MailService } from './mail.service.js';

export function makeMailService(): MailService {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;

  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS || !MAIL_FROM) {
    throw new Error('Mail environment variables are not defined');
  }

  const mailPort = Number(MAIL_PORT);

  if (Number.isNaN(mailPort)) {
    throw new Error('MAIL_PORT must be a valid number');
  }

  return new MailService(MAIL_HOST, mailPort, MAIL_USER, MAIL_PASS, MAIL_FROM);
}
