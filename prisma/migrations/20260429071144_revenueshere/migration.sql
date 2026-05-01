/*
  Warnings:

  - Added the required column `adminPercent` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.
  - Added the required column `managerPercent` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RevenueStatus" AS ENUM ('PENDING', 'SETTLED', 'REFUNDED');

-- AlterTable
ALTER TABLE "revenue_shares" ADD COLUMN     "adminPercent" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "managerPercent" DECIMAL(5,2) NOT NULL,
ADD COLUMN     "status" "RevenueStatus" NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "revenue_shares_eventId_idx" ON "revenue_shares"("eventId");

-- CreateIndex
CREATE INDEX "revenue_shares_status_idx" ON "revenue_shares"("status");
