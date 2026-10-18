import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateOrderDto {
    @IsOptional()
    @IsString({ message: 'Customer verification name must contain plain standard characters.' })
    customerName?: string;

    @IsOptional()
    @IsString({ message: 'Logistics fulfillment delivery destination address parameter must be text.' })
    deliveryAddress?: string;

    @IsOptional()
    @IsString({ message: 'Logistics cargo pickup dispatch station marker parameters must be text.' })
    pickupLocation?: string;
}
