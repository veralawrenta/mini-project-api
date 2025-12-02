import { Router } from "express";
import { ReviewController } from "./review-controller";


export class ReviewRouter {
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.router = Router();
    this.reviewController = new ReviewController();
    this.routes();
  }

  private routes() {
    this.router.post("/", this.reviewController.createReview);
    this.router.get("/event/:id", this.reviewController.getReviewsByEvent)
    this.router.get("/organizer/:id", this.reviewController.getReviewsByOrganizer)
  }
    

  public getRouter() {
    return this.router;
  }
}
