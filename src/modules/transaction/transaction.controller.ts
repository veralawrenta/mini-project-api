import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { PrismaService } from "../prisma/prisma.service";

export class TransactionController {
  transactionService: TransactionService;
  prisma: PrismaService;

  constructor() {
    this.transactionService = new TransactionService();
    this.prisma = new PrismaService();
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

  getAllTransactionsbyEvent = async (req: Request, res: Response) => {
    const { eventId, userId } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "No userId provided" });
    }

    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizerId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not the owner of this event" });
    }
    const result = await this.transactionService.getAllTransactionsbyEvent(
      eventId
    );
    return res.status(200).send(result);
  };

  getTransactionbyId = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const transaction = await this.transactionService.getTransactionById(id);
    return res.status(200).send(transaction);
  };

  updateTransactionPaymentProof = async (req: Request, res: Response) => {
    console.log("Files received:", req.files);
    console.log("Body:", req.body);
    const id = Number(req.params.id);

    if (!req.files || (Array.isArray(req.files) ? req.files.length === 0 : Object.keys(req.files).length === 0)) {
      return res
        .status(400)
        .send({ message: "Payment proof file is required" });
    }
    const file = Array.isArray(req.files) ? req.files[0] : Object.values(req.files)[0][0];
    const transaction =
      await this.transactionService.updateTransactionPaymentProof(id, file);
    res.status(200).send({
      message: "Payment proof uploaded successfully",
      data: transaction,
    });
  };
}
