import { Router } from "express";
import {
  userLogout,
  refreshToken,
  userLogin,
  userRegister,
} from "../controllers/auth.controller.ts";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.ts";

const authRoutes = Router();

authRoutes.post("/register", authRateLimiter, userRegister);
authRoutes.post("/login", authRateLimiter, userLogin);
authRoutes.post("/refresh", authRateLimiter, refreshToken);
authRoutes.post("/logout", authRateLimiter, userLogout);

export { authRoutes };
