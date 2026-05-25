import rateLimit from 'express-rate-limit';
import { errorResponse } from '../utils/apiResponse.js';

export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many requests, please try again later'),
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: errorResponse('Too many login attempts, please try again later'),
});
