-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('USER', 'ADMIN', 'MANAGER');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "role" "UserType" NOT NULL DEFAULT 'USER';
