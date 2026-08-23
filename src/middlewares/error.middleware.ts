import type { Request, Response, NextFunction } from "express";

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  return res.status(400).json({
    success: false,
    message: err.message,
  });
};
