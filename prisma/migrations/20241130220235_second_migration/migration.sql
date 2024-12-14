/*
  Warnings:

  - You are about to drop the column `organizationId` on the `history` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `history` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "history" DROP COLUMN "organizationId",
DROP COLUMN "projectId";
