/*
  Warnings:

  - You are about to drop the column `coupon_code` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `is_used` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `available_seat` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `end_time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `organizer_id` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `start_time` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `referred_id` on the `referralUsages` table. All the data in the column will be lost.
  - You are about to drop the column `referrer_id` on the `referralUsages` table. All the data in the column will be lost.
  - You are about to drop the column `transaction_id` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `coupon_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `point_used` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `voucher_id` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the column `referral_code` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `event_id` on the `vouchers` table. All the data in the column will be lost.
  - You are about to drop the column `voucher_code` on the `vouchers` table. All the data in the column will be lost.
  - Added the required column `couponCode` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `availableSeats` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizerId` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referredId` to the `referralUsages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referrerId` to the `referralUsages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transactionId` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventId` to the `vouchers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `voucherCode` to the `vouchers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_user_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_organizer_id_fkey";

-- DropForeignKey
ALTER TABLE "referralUsages" DROP CONSTRAINT "referralUsages_referred_id_fkey";

-- DropForeignKey
ALTER TABLE "referralUsages" DROP CONSTRAINT "referralUsages_referrer_id_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_transaction_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_coupon_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_event_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_user_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_voucher_id_fkey";

-- DropForeignKey
ALTER TABLE "vouchers" DROP CONSTRAINT "vouchers_event_id_fkey";

-- DropIndex
DROP INDEX "events_title_category_idx";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "coupon_code",
DROP COLUMN "is_used",
DROP COLUMN "user_id",
ADD COLUMN     "couponCode" TEXT NOT NULL,
ADD COLUMN     "isUsed" BOOLEAN DEFAULT false,
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "events" DROP COLUMN "available_seat",
DROP COLUMN "end_time",
DROP COLUMN "organizer_id",
DROP COLUMN "start_time",
ADD COLUMN     "availableSeats" INTEGER NOT NULL,
ADD COLUMN     "endTime" TEXT,
ADD COLUMN     "organizerId" INTEGER NOT NULL,
ADD COLUMN     "startTime" TEXT;

-- AlterTable
ALTER TABLE "referralUsages" DROP COLUMN "referred_id",
DROP COLUMN "referrer_id",
ADD COLUMN     "referredId" INTEGER NOT NULL,
ADD COLUMN     "referrerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "transaction_id",
ADD COLUMN     "transactionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "coupon_id",
DROP COLUMN "event_id",
DROP COLUMN "point_used",
DROP COLUMN "total_price",
DROP COLUMN "user_id",
DROP COLUMN "voucher_id",
ADD COLUMN     "couponId" INTEGER,
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "pointUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "voucherId" INTEGER;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "referral_code",
ADD COLUMN     "referralCode" TEXT;

-- AlterTable
ALTER TABLE "vouchers" DROP COLUMN "event_id",
DROP COLUMN "voucher_code",
ADD COLUMN     "eventId" INTEGER NOT NULL,
ADD COLUMN     "voucherCode" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coupons" ADD CONSTRAINT "coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referralUsages" ADD CONSTRAINT "referralUsages_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referralUsages" ADD CONSTRAINT "referralUsages_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
