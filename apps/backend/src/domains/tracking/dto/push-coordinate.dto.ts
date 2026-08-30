import { IsNotEmpty, IsNumber, IsMongoId } from 'class-validator';

export class PushCoordinateDto {
    @IsMongoId({ message: 'A valid MongoDB registration ObjectId string is required for orderId mapping.' })
    @IsNotEmpty()
    orderId!: string;

    @IsNumber({}, { message: 'Latitude parameter must be a precise floating-point numeric coordinate.' })
    @IsNotEmpty()
    latitude!: number;

    @IsNumber({}, { message: 'Longitude parameter must be a precise floating-point numeric coordinate.' })
    @IsNotEmpty()
    longitude!: number;
}
