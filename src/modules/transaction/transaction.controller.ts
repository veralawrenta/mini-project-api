import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";

export class TransactionController {
  transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  createTransaction = async (req: Request, res: Response) => {
    const userId = Number(req.body.userId);
    //const authUserId = Number(res.locals.user.id);

    if (!userId) {
      return res.status(400).send({
        message: "userId is required",
      });
    }

    const result = await this.transactionService.createTransaction(
      req.body,
      userId
      //authUserId
    );
    return res.status(200).send(result);
  };

  /*getAllTransactionsbyEvent = async (req: Request, res: Response) => {
    const result = await this.transactionService.getAllTransactionsbyEvent();
    return res.status(200).send(result);
  };*/

  getTransactionbyId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const transaction = await this.transactionService.getTransactionById(id);
    return res.status(200).send(transaction);
  };

  uploadPaymentTransaction = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    //const userId = Number(req.locals.user?.id)
    const userId = Number(req.body.userId);
    const {payment_proof} = req.body;

    if (!payment_proof) {
      return res.status(400).send({ message: "Your payment proof is required" });
    }

    const transaction = await this.transactionService.uploadPaymentTransaction(
      id,
      userId,
      payment_proof,
    );

    return res.status(200).send({
      message: "Payment proof uploaded successfully",
      transaction,
  })
}
}
