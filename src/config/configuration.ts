import dotenv from "dotenv";
dotenv.config();
import packageJson from "../../package.json" with { type: "json" };
const config = {
  SERVICE_NAME: packageJson.name,
  PORT: Number(process.env.PORT) || 4001,
  NODE_ENV: process.env.NODE_ENV || "development",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  REDIS_URL: process.env.REDIS_URL || "redis://:irctpass@localhost:6379",
  ALLOWED_OROGINS: process.env.ALLOWED_ORIGINS || "http://localhost:5173",
  JWT_ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
  JWT_ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY,
  JWT_REFRESH_TOKEN: process.env.JWT_REFRESH_TOKEN,
  JWT_REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY,
};
export { config };
