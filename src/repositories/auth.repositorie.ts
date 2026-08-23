import prisma from "../config/database.ts";
import { hashToken } from "../utils/token.ts";
export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      password,
    },
  });
};
export const createRefreshToken = async (userId: number, token: string) => {
  const tokenHash = hashToken(token);
  return await prisma.refreshToken.create({
    data: {
      userId,
      token: tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
};

export const findByUserId = async (id: number) => {
  return await prisma.user.findUnique({
    where: {
      id,
    },
  });
};
export const findRefreshToken = async (token: string) => {
  const tokenHash = hashToken(token);
  return await prisma.refreshToken.findUnique({
    where: {
      token: tokenHash,
    },
  });
};
export const revokeRefreshToken = async (token: string) => {
  const tokenHash = hashToken(token);
  return prisma.refreshToken.updateMany({
    where: {
      token: tokenHash,
      revoked: false,
    },
    data: {
      revoked: true,
    },
  });
};
