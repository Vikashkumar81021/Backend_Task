import type { Request, Response, NextFunction } from "express";
import type { OrgRole } from "../generated/prisma/enums.ts";
import { STATUS_CODE } from "../constant/status.code.ts";
import { ERROR_MESSAGE } from "../constant/error.ts";

export const requireRole = (...roles: OrgRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(STATUS_CODE.FORBIDDEN).json({
        success: false,
        error: ERROR_MESSAGE.FORBIDDEN,
        code: STATUS_CODE.FORBIDDEN,
      });
    }

    next();
  };
};
