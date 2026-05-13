/*
  Warnings:

  - The primary key for the `revenue_shares` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role` on the `transaction` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `wallet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "revenue_shares" DROP CONSTRAINT "revenue_shares_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "revenue_shares_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "revenue_shares_id_seq";

-- AlterTable
ALTER TABLE "transaction" DROP COLUMN "role";

-- AlterTable
ALTER TABLE "wallet" DROP COLUMN "role";

-- CreateTable
CREATE TABLE "admin_wallet" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "balance" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_transaction" (
    "id" SERIAL NOT NULL,
    "admin_wallet_id" INTEGER NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "booking_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "type" "transaction_type" NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_wallet_admin_id_key" ON "admin_wallet"("admin_id");

-- CreateIndex
CREATE INDEX "admin_transaction_admin_wallet_id_idx" ON "admin_transaction"("admin_wallet_id");

-- CreateIndex
CREATE INDEX "admin_transaction_admin_id_idx" ON "admin_transaction"("admin_id");

-- CreateIndex
CREATE INDEX "admin_transaction_booking_id_idx" ON "admin_transaction"("booking_id");

-- AddForeignKey
ALTER TABLE "admin_wallet" ADD CONSTRAINT "admin_wallet_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_transaction" ADD CONSTRAINT "admin_transaction_admin_wallet_id_fkey" FOREIGN KEY ("admin_wallet_id") REFERENCES "admin_wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_transaction" ADD CONSTRAINT "admin_transaction_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_transaction" ADD CONSTRAINT "admin_transaction_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
