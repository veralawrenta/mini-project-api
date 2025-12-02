import { IsInt, IsString, IsDateString, IsNotEmpty } from "class-validator";

export class CreateVoucherDTO {
  @IsInt()
  eventId!: number;

  @IsString()
  @IsNotEmpty()
  voucherCode!: string;

  @IsInt()
  discount!: number;

  @IsInt()
  quantity!: number;

  @IsDateString()
  expiredAt!: string;
}
