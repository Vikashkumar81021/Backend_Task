import { Job } from "bullmq";
import { emailQueue } from "../queues/email.queue.ts";

export const getJobStatusService = async (jobId: string) => {
  const job = await Job.fromId(emailQueue, jobId);

  if (!job) {
    throw new Error("JOB_NOT_FOUND");
  }

  const state = await job.getState();

  let status: "pending" | "active" | "completed" | "failed";

  switch (state) {
    case "waiting":
    case "delayed":
      status = "pending";
      break;

    case "active":
      status = "active";
      break;

    case "completed":
      status = "completed";
      break;

    case "failed":
      status = "failed";
      break;

    default:
      status = "pending";
  }

  return {
    jobId: job.id,
    status,
    name: job.name,
    data: job.data,
    attemptsMade: job.attemptsMade,
    failedReason: job.failedReason ?? null,
  };
};
