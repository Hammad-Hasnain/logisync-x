import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Connection, Error, Model, Types } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { TrackingService } from '../tracking/tracking.service';
import { AssignDriverDto } from '../drivers/dto/assign-driver.dto';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
        private readonly trackingService: TrackingService,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async create(createOrderDto: CreateOrderDto): Promise<OrderDocument> {
        const { trackingId } = createOrderDto;

        const existingOrder = await this.orderModel.findOne({ trackingId }).exec();
        if (existingOrder) {
            throw new ConflictException('An order with this tracking validation ID already exists.');
        }

        const newOrder = new this.orderModel(createOrderDto);
        return newOrder.save();
    }

    async assignDriver(orderId: string, assignDriverDto: AssignDriverDto): Promise<OrderDocument> {
        const { driverId } = assignDriverDto;
        const session = await this.connection.startSession();

        try {
            let updatedOrder: OrderDocument;

            await session.withTransaction(async () => {
                const order = await this.orderModel.findById(orderId).session(session);
                if (!order) {
                    throw new NotFoundException('Order not found');
                }

                order.assignedDriverId = new Types.ObjectId(driverId);

                if (order.status === OrderStatus.PENDING) {
                    order.status = OrderStatus.PICKED_UP;
                }

                updatedOrder = await order.save({ session });

                await this.trackingService.initializeStream(
                    { orderId, driverId },
                    session,
                );
            });

            return updatedOrder!;
        } catch (error) {
            if (error instanceof NotFoundException || error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException(
                `Order assignment failed: ${(error as Error).message}`,
            );
        } finally {
            await session.endSession();
        }
    }

    async findAll(): Promise<OrderDocument[]> {
        return this.orderModel.find().exec();
    }

    async findById(id: string): Promise<OrderDocument> {
        const order = await this.orderModel.findById(id).exec();

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    async updateStatus(orderId: string, status: OrderStatus) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async update(id: string, dto: UpdateOrderDto): Promise<OrderDocument> {
        const order = await this.orderModel.findByIdAndUpdate(id, dto, { returnDocument: 'after', runValidators: true });
        if (!order) {
            throw new NotFoundException('Order not found');
        }
        return order;
    }
}
