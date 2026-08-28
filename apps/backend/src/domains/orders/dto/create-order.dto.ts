import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty({ message: 'Order reference tracking ID is mandatory.' })
    trackingId!: string;

    @IsString()
    @IsNotEmpty({ message: 'Pickup origin address details cannot be empty.' })
    originAddress!: string;

    @IsString()
    @IsNotEmpty({ message: 'Destination delivery target address cannot be empty.' })
    destinationAddress!: string;

    @IsNumber()
    @Min(0, { message: 'Billing settlement amount must be a positive numeric value.' })
    billingAmount!: number;
}
