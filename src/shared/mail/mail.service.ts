import nodemailer from 'nodemailer';
import type { Mail } from './mail.types.js';

export interface IMailService {
  send(mail: Mail): Promise<unknown>;
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
    });
  }

  send(mail: Mail) {
    return this.transport.sendMail({
      from: this.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.message,
      html: mail.html,
    });
  }
}
