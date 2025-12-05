import cron from "node-cron";
import { PrismaService } from "../modules/prisma/prisma.service";
import { Status } from "../generated/prisma/enums";

export const checkCanceledTransactionScheduler = () => {
  const prisma = new PrismaService();

  cron.schedule("*/30 * * * * *", async () => {
    console.log("[CRON] Checking expired transactions...");

    const THREE_DAYS = 1000 * 60 * 60 * 24 * 3;
    const now = Date.now();

    try {
      const waitingTransactions = await prisma.transaction.findMany({
        where: { status: Status.WAITING_FOR_ORGANIZER_CONFIRMATION },
        select: {
          id: true,
          eventId: true,
          quantity: true,
          updatedAt: true,
          userId: true,
          pointUsed: true,
          voucherId: true,
          couponId: true,
        },
      });

      if (waitingTransactions.length === 0) {
        console.log("[CRON] No waiting transactions found.");
        return;
      }

      const canceledTransactions = waitingTransactions.filter((trx) => {
        return now - trx.updatedAt.getTime() > THREE_DAYS;
      });

      if (canceledTransactions.length === 0) {
        console.log("[CRON] No expired transactions.");
        return;
      }

      const canceledIds = canceledTransactions.map((t) => t.id);

      await prisma.transaction.updateMany({
        where: { id: { in: canceledIds } },
        data: { status: Status.CANCELED },
      });

      const seatRestoreMap: Record<number, number> = {};
      const pointRestoreMap: Record<number, number> = {}; 
      const voucherRestoreMap: Record<number, number> = {};
      const couponRestoreMap: Record<number, boolean> = {};

      canceledTransactions.forEach((trx) => {
        if (!seatRestoreMap[trx.eventId]) seatRestoreMap[trx.eventId] = 0;
        seatRestoreMap[trx.eventId] += trx.quantity;
      

      if (trx.pointUsed && trx.pointUsed > 0) {
        if (!pointRestoreMap[trx.userId]) pointRestoreMap[trx.userId] = 0;
        pointRestoreMap[trx.userId] += trx.pointUsed;
      }

      if (trx.voucherId) {
        if (!voucherRestoreMap[trx.voucherId]) voucherRestoreMap[trx.voucherId] = 0;
        voucherRestoreMap[trx.voucherId] += 1;
      }
    
      if (trx.couponId) {
        couponRestoreMap[trx.couponId] = true; // mark to reset isUsed = false
      }
    });

    await Promise.all(
      Object.entries(seatRestoreMap).map(([eventId, qty]) =>
        prisma.event.update({
          where: { id: Number(eventId) },
          data: { availableSeats: { increment: qty } },
        })
      )
    );
      await Promise.all(
        Object.entries(pointRestoreMap).map(([userId, points]) =>
          prisma.user.update({
            where: { id: Number(userId) },
            data: { point: { increment: points } },
          })
        )
      );
      await Promise.all(
        Object.entries(voucherRestoreMap).map(([voucherId, qty]) =>
          prisma.voucher.update({
            where: { id: Number(voucherId) },
            data: { quantity: { increment: qty } },
          })
        )
      );

      // Coupon reset
      await Promise.all(
        Object.keys(couponRestoreMap).map((couponId) =>
          prisma.coupon.update({
            where: { id: Number(couponId) },
            data: { isUsed: false },
          })
        )
      );
      console.log("[CRON] Restore operations completed successfully.");
    } catch (error) {
      console.error("[CRON ERROR] Failed to process expired transactions:", error);
    }
  });
};