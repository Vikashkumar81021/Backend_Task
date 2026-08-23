import { STATUS_CODE } from "../constant/status.code.ts";
import { asyncHandler } from "../utils/asyncHandle.ts";
import type { Request, Response } from "express";

import {
  loginAuthSchema,
  registerSchema,
} from "../validators/auth.validators.ts";
import {
  refreshTokenService,
  userLoginService,
  userRegisterService,
} from "../services/auth.service.ts";
import { revokeRefreshToken } from "../repositories/auth.repositorie.ts";

export const userRegister = asyncHandler(
  async (req: Request, res: Response) => {
    const validateData = registerSchema.parse(req.body);

    const registerUser = await userRegisterService(validateData);
    res.cookie("accessToken", registerUser.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", registerUser.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(STATUS_CODE.CREATED).json({
      success: true,
      message: "User registered successfully",
      data: registerUser.user,
    });
  },
);

export const userLogin = asyncHandler(async (req: Request, res: Response) => {
  const validateData = loginAuthSchema.parse(req.body);
  const { user, accessToken, refreshToken } =
    await userLoginService(validateData);
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  return res.status(STATUS_CODE.SUCCESS).json({
    success: true,
    message: "Login successfully",
    data: user,
  });
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;
    console.log("token", token);

    const accessToken = await refreshTokenService(token);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    });

    return res.status(STATUS_CODE.SUCCESS).json({
      success: true,
      message: "Access token refreshed successfully",
    });
  },
);
export const userLogout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await revokeRefreshToken(token);
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  return res.status(STATUS_CODE.SUCCESS).json({
    success: true,
    message: "Logout successfully",
  });
});
