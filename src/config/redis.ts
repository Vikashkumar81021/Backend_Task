import { Redis } from "ioredis";
import { config } from "../config/configuration.ts";

const redis = new Redis(config.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (error: Error) => {
  console.error("Redis error:", error);
});

export default redis;
