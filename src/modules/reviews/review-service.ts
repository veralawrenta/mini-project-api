import { PrismaService } from "../prisma/prisma.service";
import { ApiError } from "../../utils/api.error";
import { CreateReviewDTO } from "./dto/create-review.dto";
import { Status } from "../../generated/prisma/enums";

export class ReviewService {
  prisma: PrismaService;

  constructor() {
    this.prisma = new PrismaService();
  }

  createReview = async (data: CreateReviewDTO) => {
    const { transactionId, rating, comment, userId } = data;

    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { event: true },
    });

    if (!transaction) {
      throw new ApiError("Transaction not found", 404);
    }


    if (transaction.userId !== userId) {
      throw new ApiError("Unauthorized — not your transaction", 403);
    }

    if (transaction.status !== Status.ACCEPTED) {
      throw new ApiError("Cannot review — payment not confirmed", 400);
    }

    const event = transaction.event;
    if (!event) throw new ApiError("Event not found", 404);
    if (event.date > new Date())
      throw new ApiError("Event not yet completed", 400);

    const existingReview = await this.prisma.review.findFirst({
      where: { transactionId },
    });
    if (existingReview) {
      throw new ApiError("Review already exists for this transaction", 400);
    }

    const review = await this.prisma.review.create({
      data: {
        transactionId,
        userId,
        eventId: transaction.eventId,
        rating,
        comment,
      },
    });

    return review;
  };

  getReviewsByEvent = async (eventId: number) => {
    return this.prisma.review.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        transaction: true,
      },
    });
  };

  getReviewsbyOrganizerId = async (organizerId: number) => {
    const review = await this.prisma.review.findMany({
      where: {
        event: {
          organizerId: organizerId,
        },
      },
      include: {
        user: { select: { id: true, name: true, email: true } },
        transaction: true,
        event: true,
      },
    });
  };
}
