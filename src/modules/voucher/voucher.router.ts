// src/modules/voucher/voucher.router.ts
import { Router } from "express";
import { VoucherController } from "./voucher.controller";

export class VoucherRouter {
  private router: Router;
  private voucherController: VoucherController;

  constructor() {
    this.router = Router();
    this.voucherController = new VoucherController();
    this.routes();
  }

  private routes() {
    this.router.post("/", this.voucherController.createVoucher);
    this.router.post("/:eventId/validate", this.voucherController.getVoucherForEvent);
    this.router.patch('/:id', this.voucherController.updateVoucher);
    this.router.get("/organizer/:id", this.voucherController.getVouchersByOrganizer);
    this.router.get("/:id", this.voucherController.getVoucherById);
  }

  public getRouter() {
    return this.router;
  }
}
