import { IsEnum, IsNotEmpty } from 'class-validator';
import { OrderStatus } from 'src/shared/enums/order-status.enum';

export class UpdateOrderStatusDto {
    @IsNotEmpty({ message: 'Dynamic order status lifecycle state level parameter cannot be left blank.' })
    @IsEnum(OrderStatus, { message: 'Provided configuration target state level must follow standard order lifecycles.' })
    status!: OrderStatus;
}
