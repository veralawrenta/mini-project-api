
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { CreateVoucherDTO } from "./dto/create-voucher.dto";
import { VoucherService } from "./voucher.service";
import { UpdateVoucherDTO } from "./dto/update-voucher.dto";

export class VoucherController {
  private voucherService: VoucherService;

  constructor() {
    this.voucherService = new VoucherService();
  }

  createVoucher = async (req: Request, res: Response) => {
      const voucher = plainToInstance(CreateVoucherDTO, req.body);
      const errors = await validate(voucher);

      if (errors.length > 0) {
        return res.status(400).send({ errors });
      }

      const createVoucher = await this.voucherService.createVoucher(voucher);
      return res.status(201).send(createVoucher);
  };

  getVoucherForEvent = async (req: Request, res: Response) => {
      const { voucherCode, userId } = req.body;
      const { eventId } = req.params;

      if (!voucherCode) {
        return res.status(400).send({ message: "voucherCode is required" });
      }

      const voucher = await this.voucherService.getVoucherForEvent(
        Number(eventId),
        voucherCode,
        Number(userId),
      );

      return res.send({
        message: "Voucher is valid",
        discount: voucher.discount,
        voucher,
      });
  };

  getVouchersByOrganizer = async (req: Request, res: Response) => {
    try {
      const organizerId = Number(req.params.organizerId);

      if (isNaN(organizerId)) {
        return res.status(400).json({ message: "Invalid organizerId" });
      }

      const vouchers = await this.voucherService.getVouchersByOrganizer(
        organizerId,
      );

      return res.status(200).send({
        message: "Vouchers fetched successfully",
        data: vouchers,
      });
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    };
  };

  getVoucherById = async (req: Request, res: Response) => {
      const id = Number(req.params.id);
      const voucher = await this.voucherService.getVoucherById(id);
      return res.status(200).send(voucher);
  };

  updateVoucher = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const body = req.body;

    //const organizerId = req.user?.id; // Make sure your middleware sets this

    const voucherdto = new UpdateVoucherDTO();
    Object.assign(voucherdto, body);

    const errors = await validate(voucherdto);
    if (errors.length > 0) {
      return res.status(400).send(errors);
    }

    const updated = await this.voucherService.updateVoucher(
      id,
      voucherdto,
      //organizerId
    );

    return res.send({
      message: "Voucher updated successfully",
      voucher: updated,
    });
  };
};
