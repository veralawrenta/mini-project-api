import { IsEnum, IsNotEmpty } from "class-validator";
import { Status } from "../../../generated/prisma/enums";

export class UpdateTransactionbyOrganizerDTO {
    @IsEnum(Status)
    @IsNotEmpty()
    status!: "ACCEPTED" | "REJECTED"
}