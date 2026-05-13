-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_booking_id_fkey";

-- AlterTable
ALTER TABLE "transaction" ALTER COLUMN "booking_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
