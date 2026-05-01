/*
  Warnings:

  - Added the required column `platformFee` to the `revenue_shares` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "revenue_shares" ADD COLUMN     "platformFee" DECIMAL(10,2) NOT NULL;
