import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/assign')
    async assignDriver(
        @Param('id') id: string,
        @Body() assignDriverDto: AssignDriverDto,
    ): Promise<Order> {
        return this.ordersService.assignDriver(id, assignDriverDto);
    }
}
