import { Request, Response } from "express";
import { CreateReviewDTO } from "./dto/create-review.dto";
import { ReviewService } from "./review-service";

export class ReviewController {
  private reviewService: ReviewService;

  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req: Request, res: Response) => {
    const { transactionId, rating, comment, userId } = req.body;
    //const userId = Number(req.user?.id);from auth middleware
    if (!transactionId || !rating || !comment || !userId) {
      return res
        .status(400)
        .json({ message: "transactionId, rating, and userId are required" });
    }

    const data: CreateReviewDTO = {
      transactionId,
      rating,
      comment,
      userId,
    };

    const review = await this.reviewService.createReview(data);

    res.status(201).send({
      message: "Review created successfully",
      review,
    });
  };

  getReviewsByEvent = async (req: Request, res: Response) => {
    const eventId = Number(req.params.eventid);
    const reviews = await this.reviewService.getReviewsByEvent(eventId);
    return res.send({ reviews });
  };

  getReviewsByOrganizer = async (req: Request, res: Response) => {
    const organizerId = Number(req.params.organizerId);
    const reviews = await this.reviewService.getReviewsbyOrganizer(organizerId);
    return res.send({ reviews });
  }
}
