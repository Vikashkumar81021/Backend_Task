import bcrypt from "bcrypt";
import prisma from "../config/database.ts";
import { ERROR_MESSAGE } from "../constant/error.ts";
import { config } from "../config/configuration.ts";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export const userRegisterService = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error(ERROR_MESSAGE.EMAIL_ALREADY_EXISTS);
  }

  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  const { password: _, ...userResponse } = user;

  return userResponse;
};
