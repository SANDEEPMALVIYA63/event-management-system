-- DropEnum
DROP TYPE "SeatStatus";

-- DropEnum
DROP TYPE "SeatType";

-- AddForeignKey
ALTER TABLE "revenue_shares" ADD CONSTRAINT "revenue_shares_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
