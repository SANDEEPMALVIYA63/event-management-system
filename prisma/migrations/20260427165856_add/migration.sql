/*
  Warnings:

  - You are about to drop the `EventPerformer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Performer` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `performers` to the `event` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EventPerformer" DROP CONSTRAINT "EventPerformer_eventId_fkey";

-- DropForeignKey
ALTER TABLE "EventPerformer" DROP CONSTRAINT "EventPerformer_performerId_fkey";

-- AlterTable
ALTER TABLE "event" ADD COLUMN     "performers" TEXT NOT NULL;

-- DropTable
DROP TABLE "EventPerformer";

-- DropTable
DROP TABLE "Performer";
