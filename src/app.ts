import cors from "cors";
import express, { Express } from "express";
import "reflect-metadata";
import { PORT } from "./config/env";
import { errorMiddleware } from "./middlewares/error.middleware";
import { EventRouter } from "./modules/event/event.router";
import { VoucherRouter } from "./modules/voucher/voucher.router"
import { TransactionRouter } from "./modules/transaction/transaction.router";
import { initScheduler } from "./scripts";

export class App {
  app: Express;

  constructor() {
    // constructor akan jalan setelah kita initialize class app
    this.app = express();
    this.configure();
    this.routes();
    //initScheduler();
  }

  private configure() {
    // ini hanya digunakan disini saja jadi dibuat private
    this.app.use(express.json());
    this.app.use(cors());
    this.handleError();
  }

  private routes() {
    const eventRouter = new EventRouter();
    const voucherRouter = new VoucherRouter();
    const transactionRouter = new TransactionRouter();


    this.app.use("/events", eventRouter.getRouter());
    this.app.use("/vouchers", voucherRouter.getRouter());
    this.app.use("/transactions", transactionRouter.getRouter());
  }

  private handleError() {
    this.app.use(errorMiddleware);
  }

  start() {
    this.app.listen(PORT, () =>
      console.log(`Server running on port : ${PORT}`)
    );
  }
}
