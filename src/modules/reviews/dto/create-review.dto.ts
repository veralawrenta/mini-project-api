import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateReviewDTO {
  @IsInt()
  @IsNotEmpty()
  transactionId!: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsInt()
  @IsNotEmpty()
  userId!: number;

}
