import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";

import { ERROR_MESSAGE } from "../constant/error.ts";
import { config } from "../config/configuration.ts";

import {
  findUserByEmail,
  registerUser,
  createRefreshToken,
  findByUserId,
  findRefreshToken,
} from "../repositories/auth.repositorie.ts";

interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}
interface LoginUserInput {
  email: string;
  password: string;
}
export const userRegisterService = async ({
  name,
  email,
  password,
}: RegisterUserInput) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error(ERROR_MESSAGE.EMAIL_ALREADY_EXISTS);
  }
  const hashedPassword = await bcrypt.hash(password, config.BCRYPT_ROUNDS);
  const user = await registerUser(name, email, hashedPassword);
  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_ACCESS_SECRET_KEY!,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
    },
  );
  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_REFRESH_SECRET_KEY!,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
    },
  );
  await createRefreshToken(user.id, refreshToken);
  const { password: _, ...userResponse } = user;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

export const userLoginService = async ({ email, password }: LoginUserInput) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error(ERROR_MESSAGE.INVALID_CREDENTIALS);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error(ERROR_MESSAGE.INVALID_CREDENTIALS);
  }
  const accessToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_ACCESS_SECRET_KEY!,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
    },
  );

  const refreshToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_REFRESH_SECRET_KEY!,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
    },
  );
  await createRefreshToken(user.id, refreshToken);
  const { password: _, ...userResponse } = user;

  return {
    user: userResponse,
    accessToken,
    refreshToken,
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error(ERROR_MESSAGE.TOKEN_MISSING);
  }

  let decoded: jwt.JwtPayload;

  try {
    decoded = jwt.verify(
      refreshToken,
      config.JWT_REFRESH_SECRET_KEY!,
    ) as JwtPayload;
  } catch {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }

  const userId = decoded.userId;

  if (!userId) {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }
  const storedToken = await findRefreshToken(refreshToken);

  if (!storedToken) {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }
  if (storedToken.revoked) {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }
  if (storedToken.expiresAt < new Date()) {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }

  if (storedToken.userId !== Number(userId)) {
    throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
  }

  const user = await findByUserId(Number(userId));

  if (!user) {
    throw new Error(ERROR_MESSAGE.USER_NOT_FOUND);
  }

  const newAccessToken = jwt.sign(
    {
      userId: user.id,
    },
    config.JWT_ACCESS_SECRET_KEY!,
    {
      expiresIn: config.JWT_ACCESS_EXPIRES_IN as any,
    },
  );

  return newAccessToken;
};
