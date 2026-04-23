import { prisma } from "../../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { Secret, SignOptions } from "jsonwebtoken";

// tipos
type LoginDTO = {
  login: string;
  password: string;
};

type JwtPayload = {
  userId: string;
};

// valida env (resolve o erro do TS)
const JWT_SECRET: Secret = process.env.JWT_SECRET as string;

const JWT_EXPIRES_IN: SignOptions["expiresIn"] =
  (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "1d";

export const login = async ({ login, password }: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { login },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Senha inválida");
  }

  const payload: JwtPayload = {
    userId: user.id,
  };

  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      login: user.login,
    },
    token,
  };
};
