import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { OrderStatus } from 'src/shared/enums/order-status.enum';


export type OrderDocument = HydratedDocument<Order>

@Schema({ timestamps: true })
export class Order {
    @Prop({ required: true, trim: true, unique: true })
    trackingId!: string; // Unique human-readable bill reference ID (e.g., LGS-10293)

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver', default: null })
    assignedDriverId!: MongooseSchema.Types.ObjectId | null;

    @Prop({ required: true, type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
    status!: OrderStatus;

    @Prop({ required: true, trim: true })
    senderName!: string;

    @Prop({ required: true, trim: true })
    senderPhone!: string;

    @Prop({ required: true, trim: true })
    receiverName!: string;

    @Prop({ required: true, trim: true })
    receiverPhone!: string;

    @Prop({ required: true, trim: true })
    originAddress!: string;

    @Prop({ required: true, trim: true })
    destinationAddress!: string;

    @Prop({ required: true, trim: true })
    parcelDescription!: string;

    @Prop({ required: true, type: Number, min: 0 })
    weightKg!: number;

    @Prop({ required: true, type: Number, min: 0 })
    billingAmount!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Performance Compound Indexing Optimization: 
OrderSchema.index({ status: 1 });

// Mongoose transformation
OrderSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});
