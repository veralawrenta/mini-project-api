// src/modules/voucher/voucher.router.ts
import { Router } from "express";
import { VoucherController } from "./voucher.controller";

export class VoucherRouter {
  private router: Router;
  private controller: VoucherController;

  constructor() {
    this.router = Router();
    this.controller = new VoucherController();
    this.routes();
  }

  private routes() {
    this.router.post("/", this.controller.createVoucher);
    this.router.post("/:eventId/validate", this.controller.getVoucherForEvent);
    this.router.get("/organizer/:organizerId", this.controller.getVouchersByOrganizer)
    this.router.get("/:id", this.controller.getVoucherById);
    this.router.put("/:voucherId", this.controller.updateVoucher);
  }

  public getRouter() {
    return this.router;
  }
}
