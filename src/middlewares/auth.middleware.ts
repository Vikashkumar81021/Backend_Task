import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { config } from "../config/configuration.ts";
import { ERROR_MESSAGE } from "../constant/error.ts";

interface AuthPayload {
  userId: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new Error(ERROR_MESSAGE.TOKEN_MISSING);
    }

    const decoded = jwt.verify(
      accessToken,
      config.JWT_ACCESS_SECRET_KEY!,
    ) as AuthPayload;

    if (!decoded.userId) {
      throw new Error(ERROR_MESSAGE.INVALID_TOKEN);
    }

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: ERROR_MESSAGE.INVALID_TOKEN,
    });
  }
};
