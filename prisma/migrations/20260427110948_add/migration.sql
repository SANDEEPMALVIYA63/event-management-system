/*
  Warnings:

  - You are about to drop the column `hostName` on the `venues` table. All the data in the column will be lost.
  - Added the required column `name` to the `venues` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "venues" DROP COLUMN "hostName",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Performer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT,

    CONSTRAINT "Performer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPerformer" (
    "eventId" INTEGER NOT NULL,
    "performerId" INTEGER NOT NULL,

    CONSTRAINT "EventPerformer_pkey" PRIMARY KEY ("eventId","performerId")
);

-- AddForeignKey
ALTER TABLE "EventPerformer" ADD CONSTRAINT "EventPerformer_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPerformer" ADD CONSTRAINT "EventPerformer_performerId_fkey" FOREIGN KEY ("performerId") REFERENCES "Performer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
