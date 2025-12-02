import { IsEnum, IsOptional, IsString } from "class-validator";
import { PaginationQueryParams } from "../../pagination/dto/pagination.dto";
import { Category, City } from "../../../generated/prisma/enums";


export class GetEventsDTO extends PaginationQueryParams {
    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsEnum(Category)
    category?: Category;

}