import { IsDateString, IsEnum, IsInt, IsOptional, IsString } from "class-validator";
import { Category, City, VenueType } from "../../../generated/prisma/enums";

export class UpdateEventDTO {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsEnum(Category)
    category?: Category;

    @IsOptional()
    @IsDateString()
    date?: string;

    @IsOptional()
    @IsEnum(City)
    city?: City;

    @IsOptional()
    @IsString()
    venue?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsEnum(VenueType)
    venue_type?: VenueType;

    @IsOptional()
    @IsInt()
    available_seat?: number;

    @IsOptional()
    @IsInt()
    price?: number;

    @IsOptional()
    @IsString()
    banner?: string;

    @IsOptional()
    @IsDateString()
    start_time?: string;

    @IsOptional()
    @IsDateString()
    end_time?: string;
}
