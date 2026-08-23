import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/configuration.ts";
import { ERROR_MESSAGE } from "../constant/error.ts";
import { STATUS_CODE } from "../constant/status.code.ts";
import { findByUserId } from "../repositories/auth.repositorie.ts";
import { findMembershipByUserId } from "../repositories/org.repository.ts";
import { logger } from "../config/logger.ts";

interface AuthPayload {
  userId: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGE.TOKEN_MISSING,
        code: "TOKEN_MISSING",
      });
    }

    const decoded = jwt.verify(
      accessToken,
      config.JWT_ACCESS_SECRET_KEY!,
    ) as AuthPayload;

    if (!decoded.userId) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGE.INVALID_TOKEN,
        code: "INVALID_TOKEN",
      });
    }
    const user = await findByUserId(decoded.userId);

    if (!user) {
      return res.status(STATUS_CODE.UNAUTHORIZED).json({
        success: false,
        error: ERROR_MESSAGE.UNAUTHORIZED,
        code: "UNAUTHORIZED",
      });
    }
    const membership = await findMembershipByUserId(decoded.userId);

    if (!membership) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: "User is not a member of any organization",
        code: "ORG_MEMBERSHIP_NOT_FOUND",
      });
    }

    req.user = {
      userId: decoded.userId,
      organizationId: membership.organizationId,
      role: membership.role,
    };

    next();
  } catch (error) {
    logger.warn("Authentication failed", {
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return res.status(STATUS_CODE.UNAUTHORIZED).json({
      success: false,
      message: ERROR_MESSAGE.INVALID_TOKEN,
      code: "INVALID_TOKEN",
    });
  }
};
