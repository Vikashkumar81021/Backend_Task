/*
  Warnings:

  - A unique constraint covering the columns `[jobId]` on the table `OutboxEvent` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OutboxEvent" ADD COLUMN     "jobId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "OutboxEvent_jobId_key" ON "OutboxEvent"("jobId");
