import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDriverDto {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    name?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    licenseNumber?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    vehicleNumber?: string;
}