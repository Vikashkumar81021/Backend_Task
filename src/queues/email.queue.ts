import { Queue } from "bullmq";
import redis from "../config/redis.ts";

export const emailQueue = new Queue("email-queue", {
  connection: redis,

  defaultJobOptions: {
    attempts: 3,

    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
});

export const deadLetterQueue = new Queue("email-dead-letter", {
  connection: redis,
});
