import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Connection, Error, Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackingService } from '../tracking/tracking.service';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
        private readonly trackingService: TrackingService,
        @InjectConnection() private readonly connection: Connection,
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

        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            const updatedOrder = await this.orderModel.findByIdAndUpdate(
                orderId,
                {
                    assignedDriverId: new Types.ObjectId(driverId),
                    status: OrderStatus.PICKED_UP,
                },
                { returnDocument: 'after', runValidators: true, session }
            ).exec();

            if (!updatedOrder) {
                throw new NotFoundException('No registered logistics order found mapping to this identification token.');
            }

            await this.trackingService.initializeStream({
                orderId: orderId,
                driverId: driverId,
            });

            await session.commitTransaction();
            return updatedOrder;

        } catch (error) {
            await session.abortTransaction();
            throw new InternalServerErrorException(
                `Critical Logistics Transaction Failed: Order assignment aborted and rolled back due to telemetry sync error: ${(error as Error).message}`
            );
        } finally {
            await session.endSession();
        }
    }
}
