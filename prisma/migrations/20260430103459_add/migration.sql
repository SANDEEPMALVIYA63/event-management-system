-- CreateEnum
CREATE TYPE "SeatStatus" AS ENUM ('AVAILABLE', 'HOLD', 'BOOKED');

-- CreateEnum
CREATE TYPE "SeatType" AS ENUM ('VIP', 'GENERAL', 'BALCONY');

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "seatCategoryId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "seat_category" (
    "id" SERIAL NOT NULL,
    "event_id" INTEGER NOT NULL,
    "name" "SeatType" NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "totalSeats" INTEGER NOT NULL,
    "bookedSeats" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seat_category_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "seat_category_event_id_idx" ON "seat_category"("event_id");

-- AddForeignKey
ALTER TABLE "seat_category" ADD CONSTRAINT "seat_category_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_seatCategoryId_fkey" FOREIGN KEY ("seatCategoryId") REFERENCES "seat_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
