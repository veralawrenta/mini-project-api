import { ApiError } from "../../utils/api.error";
import { PrismaService } from "../prisma/prisma.service";
import { CreateVoucherDTO } from "./dto/create-voucher.dto";
import { UpdateVoucherDTO } from "./dto/update-voucher.dto";

export class VoucherService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  createVoucher = async (body: CreateVoucherDTO) => {
    return this.prisma.voucher.create({
      data: {
        eventId: body.eventId,
        voucherCode: body.voucherCode,
        discount: body.discount,
        quantity: body.quantity,
        expiredAt: new Date(body.expiredAt),
      },
    });
  };

  getVoucherForEvent = async (eventId: number, voucherCode: string) => {
    const voucher = await this.prisma.voucher.findFirst({
      where: {
        voucherCode,
        eventId,
        deletedAt: null,
        expiredAt: { gte: new Date() },
        quantity: { gt: 0 },
      },
    });

    if (!voucher) {
      throw new ApiError("Voucher invalid for this event", 400);
    }

    return voucher;
  };

  getVouchersByOrganizer = async (organizerId: number) => {
    const voucher = await this.prisma.voucher.findMany({
      where: {
        event: {
          organizerId: organizerId,
        },
      },
      include: {
        event: true,
        transactions: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    }) 
    return voucher;
  };
  
  getVoucherById = async (id: number) => {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
      include: {
        event: true,
        transactions: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });
  
    if (!voucher) {
      throw new ApiError("Voucher not found", 404);
    }
  
    return voucher;
  };

  updateVoucher = async (id: number, data:UpdateVoucherDTO) => {
    const voucher = await this.prisma.voucher.findUnique({
      where: { id },
      include: {
        event: {
          select: { organizerId: true },
        },
      },
    });
    if (!voucher) {
      throw new ApiError("Voucher not found", 404);
    }
    if (!voucher.event.organizerId) {
      throw new ApiError("Unauthorized — not event organizer", 403);
    }
    return this.prisma.voucher.update({
      where: { id },
      data
    });
  }
}
