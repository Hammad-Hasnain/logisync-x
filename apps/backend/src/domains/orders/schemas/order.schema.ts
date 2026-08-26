import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

// 1. Centralized Logistics Order Lifecycle Enum
export enum OrderStatus {
    PENDING = 'PENDING',
    PICKED_UP = 'PICKED_UP',
    IN_TRANSIT = 'IN_TRANSIT',
    DELIVERED = 'DELIVERED',
    CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Order extends Document {
    @Prop({ required: true, trim: true, unique: true })
    trackingId!: string; // Unique human-readable bill reference ID (e.g., LGS-10293)

    // 2. Relational Database Linking: Reference to our exact Driver Schema instance
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Driver', default: null })
    assignedDriverId!: MongooseSchema.Types.ObjectId | null;

    @Prop({ required: true, type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING })
    status!: OrderStatus;

    // Origin Location Parameters
    @Prop({ required: true, trim: true })
    originAddress!: string;

    // Destination Delivery Target Parameters
    @Prop({ required: true, trim: true })
    destinationAddress!: string;

    @Prop({ required: true, type: Number, min: 0 })
    billingAmount!: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// 3. Performance Compound Indexing Optimization: 
// Accelerates analytical queries fetching active routes filtered by operational status tracking
OrderSchema.index({ status: 1 });
