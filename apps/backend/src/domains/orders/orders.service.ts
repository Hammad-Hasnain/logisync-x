import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Error, Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackingService } from '../tracking/tracking.service';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        private readonly trackingService: TrackingService,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<Order> {
        const { trackingId } = createOrderDto;

        const existingOrder = await this.orderModel.findOne({ trackingId }).exec();
        if (existingOrder) {
            throw new ConflictException('An order with this tracking validation ID already exists.');
        }

        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async assignDriver(orderId: string, assignDriverDto: AssignDriverDto): Promise<Order> {
        const { driverId } = assignDriverDto;

        const updatedOrder = await this.orderModel.findByIdAndUpdate(
            orderId,
            {
                assignedDriverId: new Types.ObjectId(driverId),
                status: OrderStatus.PICKED_UP,
            },
            { returnDocument: 'after', runValidators: true }
        ).exec();

        if (!updatedOrder) {
            throw new NotFoundException('No registered logistics order found mapping to this identification token.');
        }

        try {
            await this.trackingService.initializeStream({
                orderId: orderId,
                driverId: driverId,
            });
        } catch (error) {
            console.warn(`Telemetry tracking loop initialization warning: ${(error as Error).message}`);
        }

        return updatedOrder;
    }
}
