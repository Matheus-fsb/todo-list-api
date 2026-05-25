import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import router from './routes.js';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from './middlewares/rate-limit.middleware.js';
import { errorMiddleware } from './middlewares/error.middleware.js';

const app = express();

app.use(express.json());

app.use(globalRateLimiter);

app.use(cookieParser());

app.use(router);

app.get('/', (req: Request, res: Response) => {
  return res.send(`API funcionando perfeitamente na porta ${process.env.PORT}`);
});

app.use(errorMiddleware);

export default app;
