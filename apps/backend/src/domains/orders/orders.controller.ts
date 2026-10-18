import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDocument } from './schemas/order.schema';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrderResponse } from './interfaces/order-response.interface';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        return this.ordersService.createOrder(createOrderDto);
    }

    @Get()
    async findAllOrders(): Promise<IOrderResponse[]> {
        return this.ordersService.findAllOrders();
    }

    @Get(':id')
    async findOrderById(@Param('id') id: string): Promise<IOrderResponse> {
        return this.ordersService.findOrderById(id);
    }

    @Patch(':id')
    async updateOrder(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto
    ): Promise<IOrderResponse> {
        return this.ordersService.updateOrder(id, updateOrderDto);
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<{ message: string }> {
        return this.ordersService.deleteOrder(id);
    }
}
