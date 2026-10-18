import { IsNotEmpty, IsOptional, IsString, IsMongoId } from 'class-validator';

export class CreateOrderDto {
    @IsString({ message: 'Customer verification name must contain plain standard characters.' })
    @IsNotEmpty({ message: 'Customer identity verification name parameter is strictly mandatory.' })
    customerName!: string;

    @IsOptional()
    @IsMongoId({ message: 'Assigned dynamic fleet driver identifier must be a valid Mongo Object ID layout.' })
    assignedDriverId?: string;

    @IsString({ message: 'Logistics fulfillment delivery destination address parameter must be text.' })
    @IsNotEmpty({ message: 'Logistics delivery target address field cannot be left blank.' })
    deliveryAddress!: string;

    @IsOptional()
    @IsString({ message: 'Logistics cargo pickup dispatch station marker parameters must be text.' })
    pickupLocation!: string;
}
