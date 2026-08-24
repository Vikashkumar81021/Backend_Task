-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OutboxEvent_processed_createdAt_idx" ON "OutboxEvent"("processed", "createdAt");
