import prisma from "../config/database.ts";
import { emailQueue } from "../queues/email.queue.ts";

export const publishOutboxEvents = async () => {
  const events = await prisma.outboxEvent.findMany({
    where: {
      processed: false,
    },
    orderBy: {
      createdAt: "asc",
    },
    take: 20,
  });

  for (const event of events) {
    const jobId = `outbox-${event.id}`;

    try {
      await emailQueue.add(event.type, event.payload, {
        jobId,
      });

      await prisma.outboxEvent.update({
        where: {
          id: event.id,
        },
        data: {
          processed: true,
          jobId,
        },
      });

      console.log(`Outbox event ${event.id} published successfully`);
    } catch (error) {
      console.error(`Failed to publish outbox event ${event.id}`, error);
    }
  }
};
