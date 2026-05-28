import nodemailer from 'nodemailer';
import type { MailDTO } from './mail.types.js';

export interface IMailService {
  send(mail: MailDTO): Promise<unknown>;
}

export class MailService {
  private host: string;
  private password: string;
  private user: string;
  private port: number;
  private from: string;

  private transport;

  constructor(host: string, port: number, user: string, password: string, from: string) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.from = from;

    this.transport = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      auth: { user: this.user, pass: this.password },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  send(mail: MailDTO) {
    if (process.env.NODE_ENV === 'test') {
      return Promise.resolve({ accepted: [mail.to], rejected: [] });
    }

    return this.transport.sendMail({
      from: this.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.message,
      html: mail.html,
    });
  }
}
