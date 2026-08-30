import { IsMongoId, IsNotEmpty } from 'class-validator';

export class InitializeTrackingDto {
    @IsMongoId({ message: 'A valid MongoDB hexadecimal ObjectId string is required for orderId tracking.' })
    @IsNotEmpty()
    orderId!: string;

    @IsMongoId({ message: 'A valid MongoDB hexadecimal ObjectId string is required for driverId tracking.' })
    @IsNotEmpty()
    driverId!: string;
}
