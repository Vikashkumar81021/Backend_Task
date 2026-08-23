import rateLimit from "express-rate-limit";
import { ERROR_MESSAGE } from "../constant/error.ts";

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: ERROR_MESSAGE.TOO_MANY_REQUESTS,
  },
});
