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
import { IOrderResponse } from './interfaces/order-response.interface';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

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

    async findAllOrders(): Promise<IOrderResponse[]> {
        return this.orderModel.aggregate<IOrderResponse>([
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'assignedDriverId',
                    foreignField: '_id',
                    as: 'driverDetails'
                }
            },
            {
                $unwind: {
                    path: '$driverDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: '$_id' },
                    customerName: 1,
                    assignedDriverId: {
                        $cond: {
                            if: { $ifNull: ['$driverDetails._id', false] },
                            then: { $toString: '$driverDetails._id' },
                            else: null
                        }
                    },
                    driverName: { $ifNull: ['$driverDetails.name', null] },
                    driverVehicleNumber: { $ifNull: ['$driverDetails.vehicleNumber', null] },
                    deliveryAddress: 1,
                    pickupLocation: 1,
                    status: 1,
                    trackingId: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).exec();
    }

    async findOrderById(id: string): Promise<IOrderResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID format.');
        }

        const [order] = await this.orderModel.aggregate<IOrderResponse>([
            {
                $match: {
                    _id: new Types.ObjectId(id)
                }
            },
            {
                $lookup: {
                    from: 'drivers',
                    localField: 'assignedDriverId',
                    foreignField: '_id',
                    as: 'driverDetails'
                }
            },
            {
                $unwind: {
                    path: '$driverDetails',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: '$_id' },
                    customerName: 1,
                    assignedDriverId: {
                        $cond: {
                            if: { $ifNull: ['$driverDetails._id', false] },
                            then: { $toString: '$driverDetails._id' },
                            else: null
                        }
                    },
                    driverName: { $ifNull: ['$driverDetails.name', null] },
                    driverVehicleNumber: { $ifNull: ['$driverDetails.vehicleNumber', null] },
                    deliveryAddress: 1,
                    pickupLocation: 1,
                    status: 1,
                    trackingId: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).exec();

        if (!order) {
            throw new NotFoundException('Order not found.');
        }

        return order;
    }

    async updateOrder(id: string, updateOrderDto: UpdateOrderDto): Promise<IOrderResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID format.');
        }

        const { customerName, deliveryAddress, pickupLocation } = updateOrderDto;

        const orderDoc = await this.orderModel.findById(id);
        if (!orderDoc) {
            throw new NotFoundException('Order not found.');
        }

        const orderUpdates = {
            ...(customerName && { customerName }),
            ...(deliveryAddress && { deliveryAddress }),
            ...(pickupLocation && { pickupLocation })
        };

        const hasUpdates = Object.keys(orderUpdates).length > 0;

        if (hasUpdates) {
            await this.orderModel.updateOne(
                { _id: orderDoc._id },
                { $set: orderUpdates }
            );
        }

        return this.findOrderById(id);
    }

    async deleteOrder(id: string): Promise<{ message: string }> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID format.');
        }

        const orderDoc = await this.orderModel.findById(id);
        if (!orderDoc) {
            throw new NotFoundException('Order not found.');
        }

        await this.orderModel.deleteOne({ _id: orderDoc._id });

        return { message: 'Order deleted successfully.' };
    }

    async assignDriver(id: string, assignDriverDto: AssignDriverDto): Promise<IOrderResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID format.');
        }

        const { driverId } = assignDriverDto;
        const driverObjId = new Types.ObjectId(driverId);

        await this.driversService.findDriverById(driverId);

        const orderDoc = await this.orderModel.findById(id);
        if (!orderDoc) {
            throw new NotFoundException('Order not found.');
        }

        const session = await this.connection.startSession();

        try {
            await session.withTransaction(async () => {
                await this.orderModel.updateOne(
                    { _id: orderDoc._id },
                    {
                        $set: {
                            assignedDriverId: driverObjId,
                            status: OrderStatus.ASSIGNED
                        }
                    },
                    { session }
                );

                await this.trackingService.initializeTrackingLog(
                    orderDoc._id,
                    driverObjId,
                    session
                );
            });
        } finally {
            await session.endSession();
        }

        return this.findOrderById(id);
    }

    async updateOrderStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto): Promise<IOrderResponse> {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestException('Invalid order ID format.');
        }

        const { status: targetStatus } = updateOrderStatusDto;

        const orderDoc = await this.orderModel.findById(id);
        if (!orderDoc) {
            throw new NotFoundException('Order not found.');
        }
        const currentStatus = orderDoc.status;


        if (targetStatus === OrderStatus.PICKED_UP && currentStatus !== OrderStatus.ASSIGNED) {
            throw new BadRequestException(`Cannot transition to PICKED_UP. Order must be ASSIGNED first.`);
        }

        if (targetStatus === OrderStatus.IN_TRANSIT && currentStatus !== OrderStatus.PICKED_UP) {
            throw new BadRequestException(`Cannot transition to IN_TRANSIT. Order must be PICKED_UP first.`);
        }

        if (targetStatus === OrderStatus.DELIVERED && currentStatus !== OrderStatus.IN_TRANSIT) {
            throw new BadRequestException(`Cannot transition to DELIVERED. Order must be IN_TRANSIT first.`);
        }

        await this.orderModel.updateOne(
            { _id: orderDoc._id },
            { $set: { status: targetStatus } }
        );

        if (targetStatus === OrderStatus.IN_TRANSIT) {
            await this.trackingService.toggleStreamActivity(orderDoc._id, true);
        } else if (targetStatus === OrderStatus.DELIVERED) {
            await this.trackingService.toggleStreamActivity(orderDoc._id, false);
        }

        return this.findOrderById(id);
    }
}

