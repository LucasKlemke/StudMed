/*
  Warnings:

  - You are about to drop the `history_messages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `messages` to the `history` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `history` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "history_messages" DROP CONSTRAINT "history_messages_historyId_fkey";

-- AlterTable
ALTER TABLE "history" ADD COLUMN     "messages" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "history_messages";
