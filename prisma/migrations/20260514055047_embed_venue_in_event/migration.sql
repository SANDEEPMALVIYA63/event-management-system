/*
  Warnings:

  - You are about to drop the column `venueId` on the `event` table. All the data in the column will be lost.
  - You are about to drop the `venues` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_venueId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "venueId",
ADD COLUMN     "venueAddress" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "venueCity" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "venueCountry" TEXT NOT NULL DEFAULT 'IN',
ADD COLUMN     "venueName" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "venueState" TEXT NOT NULL DEFAULT 'Unknown',
ADD COLUMN     "venueTotalCapacity" INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "venues";
