import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderDocument } from './schemas/order.schema';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/assign-driver')
    // @UseGuards(AuthGuard('jwt'), RolesGuard)
    // @Roles(Role.ADMIN)
    async assignDriver(
        @Param('id') id: string,
        @Body() assignDriverDto: AssignDriverDto,
    ): Promise<OrderDocument> {
        return this.ordersService.assignDriver(id, assignDriverDto);
    }

    @Get()
    async getAllOrders(): Promise<OrderDocument[]> {
        return this.ordersService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.ordersService.findById(id);
    }
}
