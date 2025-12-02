import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { UpdateTransactionbyOrganizerDTO } from "./dto/update-transaction-organizer.dto";
import { ApiError } from "../../utils/api.error";
import { Status } from "../../generated/prisma/enums";

export class TransactionController {
  transactionService: TransactionService;

  constructor() {
    this.transactionService = new TransactionService();
  }

  createTransaction = async (req: Request, res: Response) => {
    const authUserId = Number(res.locals.user.id);
    const result = await this.transactionService.createTransaction(
      req.body,
      authUserId
    );
    return res.status(200).send(result);
  };

  /*updateTransactionbyOrganizer = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    //const organizerId = Number(req.user?.id);
    const body = req.body as UpdateTransactionbyOrganizerDTO;

    //if (!organizerId) { throw new ApiError("Unauthorized", 401);}

    const updatedTransaction =
      await this.transactionService.updateTransactionbyOrganizer(
        id,
        //organizerId,
        body
      );

    res.status(200).send({
      message: `Transaction ${body.status.toLowerCase()} successfully`,
      transaction: updatedTransaction,
    });
  };

  uploadPaymentTransaction = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    //const userId = Number(req.user?.id)
    const {payment_proof} = req.body;

    if (!payment_proof) {
      return res.status(400).send({ message: "Your payment proof is required" });
    }

    const transaction = await this.transactionService.uploadPaymentTransaction(
      id,
      //userId,
      payment_proof,
    );

    return res.status(200).send({
      message: "Payment proof uploaded successfully",
      transaction,
  })
}*/
}
