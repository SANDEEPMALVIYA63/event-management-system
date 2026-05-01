/*
  Warnings:

  - You are about to drop the column `total_price` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the column `available_tickets` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `ticket_price` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `total_tickets` on the `event` table. All the data in the column will be lost.
  - Added the required column `totalPrice` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxTickets` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ticketPrice` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `venueId` to the `event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('COMEDY_SHOW', 'MUSIC_SHOW', 'THEATRE', 'SPORTS', 'CONFERENCE', 'WORKSHOP');

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "total_price",
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL;

-- AlterTable
ALTER TABLE "event" DROP COLUMN "available_tickets",
DROP COLUMN "date",
DROP COLUMN "name",
DROP COLUMN "ticket_price",
DROP COLUMN "total_tickets",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "maxTickets" INTEGER NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ticketPrice" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "ticketsSold" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "type" "EventType" NOT NULL,
ADD COLUMN     "venueId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "booking_id" INTEGER,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "venues" (
    "id" TEXT NOT NULL,
    "hostName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT,
    "country" TEXT NOT NULL DEFAULT 'IN',
    "totalCapacity" INTEGER NOT NULL,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_shares" (
    "id" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "managerId" INTEGER NOT NULL,
    "totalAmount" DECIMAL(10,2) NOT NULL,
    "adminShare" DECIMAL(10,2) NOT NULL,
    "managerShare" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "revenue_shares_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "revenue_shares_bookingId_key" ON "revenue_shares"("bookingId");

-- CreateIndex
CREATE INDEX "revenue_shares_managerId_idx" ON "revenue_shares"("managerId");

-- CreateIndex
CREATE INDEX "booking_hold_expires_at_idx" ON "booking"("hold_expires_at");

-- CreateIndex
CREATE INDEX "event_status_idx" ON "event"("status");

-- CreateIndex
CREATE INDEX "transaction_user_id_idx" ON "transaction"("user_id");

-- CreateIndex
CREATE INDEX "transaction_booking_id_idx" ON "transaction"("booking_id");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revenue_shares" ADD CONSTRAINT "revenue_shares_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
