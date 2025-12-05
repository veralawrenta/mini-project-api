//import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { Router } from "express";
import { TransactionController } from "./transaction.controller";
import { validateBody } from "../../middlewares/validation.middleware";
import { CreateTransactionDTO } from "./dto/create-transaction.dto";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";


export class TransactionRouter {
  router: Router;
  transactionController: TransactionController;
  uploaderMiddleware: UploaderMiddleware;
  //jwtMiddleware: JwtMiddleware;

  constructor() {
    this.router = Router();
    this.transactionController = new TransactionController ();
    this.uploaderMiddleware = new UploaderMiddleware();
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
    this.router.get("/event/:id", this.transactionController.getAllTransactionsbyEvent
    )
    this.router.get("/:id", this.transactionController.getTransactionbyId
    )
    this.router.post(
      "/update/:id", this.uploaderMiddleware
      .upload()
      .any(), this.transactionController.updateTransactionPaymentProof
    );
  }

  getRouter = () => {
    return this.router;
  };
}
