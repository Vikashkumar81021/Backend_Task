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

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: Authentication and authorization APIs
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account and returns authentication cookies.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
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
    // Agar tum chahte ho: Browser close → dobara browser open → login dobara karna pade
    //ANS:- MaxAge HTA  DOO
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and sets access and refresh token cookies.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid email or password
 */
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

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Generates a new access token using the refresh token stored in the HTTP-only cookie.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken;

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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Revokes the refresh token and clears authentication cookies.
 *     tags:
 *       - Authentication
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
export const userLogout = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken;

  if (token) {
    await revokeRefreshToken(token);
  }

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(STATUS_CODE.SUCCESS).json({
    success: true,
    message: "Logout successfully",
  });
});
