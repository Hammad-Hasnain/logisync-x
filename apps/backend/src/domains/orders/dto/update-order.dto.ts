import { IsString, IsNotEmpty, IsOptional, IsNumber, Min } from 'class-validator';

export class UpdateOrderDto {
    @IsString() @IsNotEmpty() @IsOptional()
    senderName?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    senderPhone?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    receiverName?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    receiverPhone?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    originAddress?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    destinationAddress?: string;

    @IsString() @IsNotEmpty() @IsOptional()
    parcelDescription?: string;

    @IsNumber() @Min(0) @IsOptional()
    weightKg?: number;

    @IsNumber() @Min(0) @IsOptional()
    billingAmount?: number;
}