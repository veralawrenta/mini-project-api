import { IsInt, IsNotEmpty, Min, IsOptional, IsString } from "class-validator";

export class CreateTransactionDTO {

  @IsInt()
  @IsNotEmpty()
  eventId!: number;

  @IsInt()
  @Min(1)
  @IsNotEmpty()
  quantity!: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  pointUsed?: number;

  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsString()
  couponCode?: string;
}
