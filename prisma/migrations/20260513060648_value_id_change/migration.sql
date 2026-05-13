/*
  Warnings:

  - The primary key for the `venues` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `venues` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `venueId` on the `event` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_venueId_fkey";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "venueId",
ADD COLUMN     "venueId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "venues" DROP CONSTRAINT "venues_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "venues_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
