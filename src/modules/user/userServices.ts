import { prisma } from "../../lib/prisma.js";
import type { DataUser } from "../types.js";
import bcrypt from "bcrypt";

export const createUser = async (data: {
  name: string;
  login: string;
  password: string;
}) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });
};

export const getUsers = async () => {
  return prisma.user.findMany({
    include: { projects: true },
  });
};

export const getUserById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { projects: true },
  });
};

export const updateUser = async (id: string, data: DataUser) => {
  return prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string) => {
  return prisma.user.delete({
    where: { id },
  });
};