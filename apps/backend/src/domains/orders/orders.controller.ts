import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDocument } from './schemas/order.schema';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { IOrderResponse } from './interfaces/order-response.interface';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        return this.ordersService.createOrder(createOrderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllOrders(): Promise<IOrderResponse[]> {
        return this.ordersService.findAllOrders();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findOrderById(@Param('id') id: string): Promise<IOrderResponse> {
        return this.ordersService.findOrderById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateOrder(
        @Param('id') id: string,
        @Body() updateOrderDto: UpdateOrderDto
    ): Promise<IOrderResponse> {
        return this.ordersService.updateOrder(id, updateOrderDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<{ message: string }> {
        return this.ordersService.deleteOrder(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/assign-driver')
    async assignDriver(
        @Param('id') id: string,
        @Body() assignDriverDto: AssignDriverDto
    ): Promise<IOrderResponse> {
        return this.ordersService.assignDriver(id, assignDriverDto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body() updateOrderStatusDto: UpdateOrderStatusDto
    ): Promise<IOrderResponse> {
        return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
    }
}
