import express from "express";
import type { Request, Response } from "express";
import "dotenv/config";
import router from "./routes.js";

const app = express();

app.use(express.json());
app.use(router);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando na porta ${process.env.PORT} => http://localhost:${process.env.PORT}`,);
});

app.get('/', (req: Request, res: Response) => {
  return res.send(`API funcionando perfeitamente na porta ${process.env.PORT}`);
});
