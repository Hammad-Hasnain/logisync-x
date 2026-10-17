import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OrderStatus } from 'src/shared/enums/order-status.enum';
import { Types } from 'mongoose';


export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, trim: true })
    customerName!: string;

    @Prop({ type: Types.ObjectId, ref: 'Driver', default: null })
    assignedDriverId!: Types.ObjectId | null;

    @Prop({ required: true, trim: true })
    deliveryAddress!: string;

    @Prop({ required: true, trim: true, default: 'Main Warehouse, Karachi' })
    pickupLocation!: string;

    @Prop({ required: true, type: String, enum: OrderStatus, default: OrderStatus.PENDING })
    status!: OrderStatus;

    @Prop({ required: true, trim: true, unique: true })
    trackingId!: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});
