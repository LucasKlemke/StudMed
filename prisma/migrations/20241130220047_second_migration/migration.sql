/*
  Warnings:

  - You are about to drop the column `selectedOrg` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `selectedProj` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "selectedOrg",
DROP COLUMN "selectedProj";
