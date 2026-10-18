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

}
