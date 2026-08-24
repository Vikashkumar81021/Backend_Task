import "./workers/email.worker.ts";
import { publishOutboxEvents } from "./workers/outbox.publisher.ts";

console.log("TaskFlow Worker started");

const runOutboxPublisher = async () => {
  try {
    await publishOutboxEvents();
  } catch (error) {
    console.error("Outbox publisher error:", error);
  }
};

runOutboxPublisher();

setInterval(runOutboxPublisher, 5000);
