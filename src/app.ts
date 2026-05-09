import express from 'express';
import type { Request, Response } from 'express';
import 'dotenv/config';
import router from './routes.js';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(router);

app.get('/', (req: Request, res: Response) => {
  return res.send(`API funcionando perfeitamente na porta ${process.env.PORT}`);
});

export default app;
