import { STATUS_CODE } from "../constant/status.code.ts";
import { asyncHandler } from "../utils/asyncHandle.ts";
import type { Request, Response } from "express";
import { createAuthSchema } from "../validators/auth.validators.ts";
const userRegister = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;
  const validateData = createAuthSchema.parse(req.body);

  return res.status(STATUS_CODE.CREATED).json({
    success: true,
    message: "User Register successfully",
  });
});
