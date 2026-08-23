import dotenv from "dotenv";

dotenv.config();

import packageJson from "../../package.json" with { type: "json" };

const config = {
  SERVICE_NAME: packageJson.name,

  PORT: Number(process.env.PORT) || 3000,

  NODE_ENV: process.env.NODE_ENV || "development",

  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",

  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,

  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",

  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",

  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS) || 12,
};

export { config };
