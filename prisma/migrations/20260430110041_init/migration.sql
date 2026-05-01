/*
  Warnings:

  - You are about to drop the column `seatCategoryId` on the `booking` table. All the data in the column will be lost.
  - You are about to drop the `seat_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking" DROP CONSTRAINT "booking_seatCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "seat_category" DROP CONSTRAINT "seat_category_event_id_fkey";

-- AlterTable
ALTER TABLE "booking" DROP COLUMN "seatCategoryId";

-- DropTable
DROP TABLE "seat_category";
