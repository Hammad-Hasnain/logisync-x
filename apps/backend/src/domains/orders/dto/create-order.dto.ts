import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
    @IsString()
    @IsNotEmpty({ message: 'Order reference tracking ID is mandatory.' })
    trackingId!: string;

    @IsString()
    @IsNotEmpty({ message: 'Sender name is mandatory.' })
    senderName!: string;

    @IsString()
    @IsNotEmpty({ message: 'Sender phone number is mandatory.' })
    senderPhone!: string;

    @IsString()
    @IsNotEmpty({ message: 'Receiver name is mandatory.' })
    receiverName!: string;

    @IsString()
    @IsNotEmpty({ message: 'Receiver phone number is mandatory.' })
    receiverPhone!: string;

    @IsString()
    @IsNotEmpty({ message: 'Pickup origin address details cannot be empty.' })
    originAddress!: string;

    @IsString()
    @IsNotEmpty({ message: 'Destination delivery target address cannot be empty.' })
    destinationAddress!: string;

    @IsString()
    @IsNotEmpty({ message: 'Parcel description cannot be empty.' })
    parcelDescription!: string;

    @IsNumber()
    @Min(0, { message: 'Weight must be a positive numeric value in Kg.' })
    weightKg!: number;

    @IsNumber()
    @Min(0, { message: 'Billing settlement amount must be a positive numeric value.' })
    billingAmount!: number;
}
