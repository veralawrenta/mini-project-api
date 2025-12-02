import { IsInt, IsString, IsDateString, IsOptional } from "class-validator";

export class UpdateVoucherDTO {
  @IsOptional()
  @IsString()
  voucherCode?: string;

  @IsOptional()
  @IsInt()
  discount?: number;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsDateString()
  expiredAt?: string;
}
