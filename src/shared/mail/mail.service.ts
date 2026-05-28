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
  private apiToken: string | undefined;

  private transport;

  constructor(host: string, port: number, user: string, password: string, from: string, apiToken?: string) {
    this.host = host;
    this.port = port;
    this.user = user;
    this.password = password;
    this.from = from;
    this.apiToken = apiToken;

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

    if (this.apiToken) {
      return this.sendWithMailtrapApi(mail);
    }

    return this.transport.sendMail({
      from: this.from,
      to: mail.to,
      subject: mail.subject,
      text: mail.message,
      html: mail.html,
    });
  }

  private async sendWithMailtrapApi(mail: MailDTO): Promise<unknown> {
    const response = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { email: this.from },
        to: [{ email: mail.to }],
        subject: mail.subject,
        text: mail.message,
        html: mail.html,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Mailtrap API error ${response.status}: ${message}`);
    }

    return response.json();
  }
}
