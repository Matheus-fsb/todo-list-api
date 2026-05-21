import rateLimit from 'express-rate-limit';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // 100 requisições por IP dentro da janela
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests, please try again later',
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // 5 tentativas por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many login attempts, please try again later',
  },
});
