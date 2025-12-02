/*
  Warnings:

  - You are about to drop the column `userId` on the `vouchers` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_userId_fkey";

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "userId";
