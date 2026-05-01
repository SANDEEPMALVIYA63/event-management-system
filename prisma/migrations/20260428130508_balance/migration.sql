/*
  Warnings:

  - You are about to alter the column `balance` on the `wallet` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "wallet" ALTER COLUMN "balance" SET DATA TYPE DECIMAL(10,2);
