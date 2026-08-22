import winston from "winston";
import { config } from "./configuration.js";

const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  defaultMeta: { serveice: config.SERVICE_NAME },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, serveice }) => {
      return `[${timestamp}] [${level}] [${serveice}]: ${message}`;
    }),
  ),
  transports: [new winston.transports.Console()],
});

export { logger };
