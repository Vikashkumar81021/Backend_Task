import { Job, Worker } from "bullmq";
import redis from "../config/redis.ts";
import { deadLetterQueue } from "../queues/email.queue.ts";

interface TaskAssignedPayload {
  taskId: number;
  userId: number;
  organizationId: number;
  userEmail: string;
  taskTitle: string;
}

const processEmailJob = async (job: Job<TaskAssignedPayload>) => {
  const { userEmail, taskTitle, taskId } = job.data;

  console.log(`
    📧 Sending email
    To: ${userEmail}
    Subject: Task Assigned
    Task: ${taskTitle}
    Task ID: ${taskId}
  `);

  return {
    success: true,
    email: userEmail,
  };
};

export const emailWorker = new Worker("email-queue", processEmailJob, {
  connection: redis,
  concurrency: 5,
});

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", async (job, error) => {
  if (!job) return;

  if (job.attemptsMade >= 3) {
    await deadLetterQueue.add("failed-email", {
      originalJobId: job.id,
      originalJobName: job.name,
      data: job.data,
      error: error.message,
      failedAt: new Date().toISOString(),
    });

    console.error(`Job ${job.id} moved to dead-letter queue`);
  }
});

emailWorker.on("error", (error) => {
  console.error("Worker error:", error);
});
