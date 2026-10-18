import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Connection, Error, Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackingService } from '../tracking/tracking.service';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { UpdateOrderDto } from './dto/update-order.dto';
import { DriversService } from '../drivers/drivers.service';
import { generateTrackingId } from 'src/shared/utils/generate-tracking-id.util';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        private readonly trackingService: TrackingService,
        private readonly driversService: DriversService,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        const { customerName, deliveryAddress, pickupLocation } = createOrderDto;

        const trackingId = generateTrackingId();

        const [newOrder] = await this.orderModel.create([
            {
                customerName,
                deliveryAddress,
                pickupLocation,
                trackingId
            }
        ]);

        return newOrder;
    }

    
}
