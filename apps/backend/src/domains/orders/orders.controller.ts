import { Body, Controller, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order } from './schemas/order.schema';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { Role } from '../../shared/enums/role.enum';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post('create')
    async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
        return this.ordersService.create(createOrderDto);
    }

    @Patch(':id/assign')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    async assignDriver(
        @Param('id') id: string,
        @Body() assignDriverDto: AssignDriverDto,
    ): Promise<Order> {
        return this.ordersService.assignDriver(id, assignDriverDto);
    }
}
