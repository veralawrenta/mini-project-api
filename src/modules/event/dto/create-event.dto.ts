import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { Category, City, VenueType } from "../../../generated/prisma/enums";

export class CreateEventDTO {
    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsString()
    @IsNotEmpty()
    description!: string;

    @IsEnum(Category)
    @IsNotEmpty()
    category!: Category;

    @IsDateString()
    @IsNotEmpty()
    date!: string;

    @IsEnum(City)
    @IsNotEmpty()
    city!: City;

    @IsString()
    @IsNotEmpty()
    venue!: string;

    @IsString()
    @IsNotEmpty()
    address!: string;

    @IsEnum(VenueType)
    @IsNotEmpty()
    venueType!: VenueType;

    @IsInt()
    @IsNotEmpty()
    availableSeats!: number;

    @IsInt()
    @IsNotEmpty()
    price!: number;

    @IsOptional()
    @IsString()
    banner?: string;

    @IsOptional()
    @IsDateString()
    startTime?: string;

    @IsOptional()
    @IsDateString()
    endTime?: string;
}