import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schemas/order.schema';
import { Model } from 'mongoose';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        @InjectModel(Order.name) private readonly orderModel: Model<Order>,
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
}
