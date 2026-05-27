declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    DIRECT_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    MAIL_HOST: string;
    MAIL_PORT: number;
    MAIL_USER: string;
    MAIL_PASS: string;
    MAIL_FROM: string;
    APP_URL: string;
  }
}
