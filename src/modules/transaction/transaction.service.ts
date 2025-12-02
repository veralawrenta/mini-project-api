import Decimal from "decimal.js";
import { ApiError } from "../../utils/api.error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDTO } from "./dto/create-transaction";
import { UpdateTransactionbyOrganizerDTO } from "./dto/update-transaction-organizer.dto";

export class TransactionService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  createTransaction = async (body: CreateTransactionDTO, userId: number) => {
    const { eventId, quantity, pointUsed = 0, voucherCode, couponCode } = body;

    return this.prisma.$transaction(async (tx) => {
      // 1. cek event ada
      const event = await tx.event.findUnique({
        where: { id: eventId },
      });

      if (!event) {
        throw new ApiError("Event not found", 404);
      }
      // 2. cek seat cukup
      if (event.availableSeats < quantity) {
        throw new ApiError("Not enough available seats", 400);
      }

      let basePrice = new Decimal(event.price).mul(quantity);
      let finalPrice = basePrice;

      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: { point: true },
      });

      if (!user) throw new ApiError("User not found", 404);

      if (pointUsed > user.point) {
        throw new ApiError("Not enough points", 400);
      }

      if (pointUsed > 0) {
        finalPrice = finalPrice.minus(pointUsed);
        if (finalPrice.lessThan(0)) finalPrice = new Decimal(0);
      }

      let appliedVoucher: any = null;

      if (voucherCode) {
        appliedVoucher = await this.prisma.voucher.findFirst({
          where: {
            voucherCode,
            eventId: eventId,
            deletedAt: null,
            expiredAt: { gte: new Date() },
          },
        });

        if (!appliedVoucher) {
          throw new ApiError("Voucher not valid for this event", 400);
        }
        if (appliedVoucher.quantity <= 0)
            throw new ApiError("Voucher is no longer available", 400);

        if (appliedVoucher.discountAmount) {
          finalPrice = finalPrice.minus(appliedVoucher.discountAmount);
        }

        if (finalPrice.lessThan(0)) finalPrice = new Decimal(0);
      }

      let appliedCoupon: any = null;

      if (couponCode) {
        appliedCoupon = await this.prisma.coupon.findFirst({
          where: {
            couponCode,
            userId,
            isUsed: false,
            expiredAt: { gte: new Date() }
          },
        });

        if (!appliedCoupon) {
          throw new ApiError("Invalid or expired coupon", 400);
        }

        if (appliedCoupon.discountAmount) {
          finalPrice = finalPrice.minus(appliedCoupon.discountAmount);
        }
        if (finalPrice.lessThan(0)) finalPrice = new Decimal(0);
      }
      const finalPriceInt = finalPrice.toNumber();

      // 3. create transaction
      const transaction = await tx.transaction.create({
        data: {
          userId,
          eventId,
          quantity,
          price: event.price,
          pointUsed: pointUsed ?? 0,
          voucherId: appliedVoucher?.id ?? null,
          couponId: appliedCoupon?.id ?? null,
          status: "WAITING_FOR_PAYMENT"
        },
      });

      // 4. decrement seat
      await tx.event.update({
        where: { id: eventId },
        data: {
          availableSeats: {
            decrement: quantity,
          },
        },
      });

      if (pointUsed > 0) {
        await tx.user.update({
          where: { id: userId },
          data: {
            point: {
              decrement: pointUsed,
            },
          },
        });
      }

      if (appliedVoucher) {
        await tx.voucher.update({
          where: { id: appliedVoucher.id },
          data: {
            quantity: { decrement: 1 },
          },
        });
      }
      
      if (appliedCoupon) {
        await tx.coupon.update({
          where: { id: appliedCoupon.id },
          data: { isUsed: true },
        });
      }
      return transaction;
    });
  };

  updateTransactionbyOrganizer = async (id: number, organizerId: number, body:UpdateTransactionbyOrganizerDTO) => {
    const { status } = body
    const transactions = await this.prisma.transaction.findFirst({
      where : { id }
    })
    
  }
}
