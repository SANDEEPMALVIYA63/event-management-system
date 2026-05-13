/*
  Warnings:

  - The primary key for the `revenue_shares` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `revenue_shares` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `role` to the `transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `booking_id` on table `transaction` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `venues` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `role` to the `wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "transaction" DROP CONSTRAINT "transaction_booking_id_fkey";

-- AlterTable
ALTER TABLE "revenue_shares" DROP CONSTRAINT "revenue_shares_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "revenue_shares_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transaction" ADD COLUMN     "role" TEXT NOT NULL,
ALTER COLUMN "booking_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "venues" ALTER COLUMN "state" SET NOT NULL;

-- AlterTable
ALTER TABLE "wallet" ADD COLUMN     "role" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

