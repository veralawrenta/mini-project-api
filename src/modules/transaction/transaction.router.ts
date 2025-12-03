//import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateTransactionDTO } from "./dto/create-transaction.dto";


export class TransactionRouter {
  router: Router;
  transactionController: TransactionController;
  //jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController ();
    //this.jwtMiddleware = new JwtMiddleware();
    this.initRoutes()
  }

  private initRoutes = () => {
    this.router.post(
      "/",
      //this.jwtMiddleware.verifyToken(process.env.JWT_SECRET!),
      validateBody(CreateTransactionDTO),
      this.transactionController.createTransaction
    );
    /*
    this.router.post(
      "/:id/upload-payment", this.transactionController.uploadPaymentTransaction
    );*/
    this.router.get("/:id", this.transactionController.getTransactionbyId);
  }

  getRouter = () => {
    return this.router;
  };
}
