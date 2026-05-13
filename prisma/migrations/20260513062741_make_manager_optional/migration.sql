-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_manager_id_fkey";

-- AlterTable
ALTER TABLE "event" ALTER COLUMN "manager_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
