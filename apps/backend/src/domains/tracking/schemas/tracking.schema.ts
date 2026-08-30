import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

// Nested Location Telemetry Structure
@Schema({ _id: false }) // Bypasses unnecessary inner auto-ID creation overhead
export class LocationCoordinate {
  @Prop({ required: true, type: Number })
  latitude!: number;

  @Prop({ required: true, type: Number })
  longitude!: number;

  @Prop({ required: true, type: Date, default: Date.now })
  timestamp!: Date;
}

@Schema({ timestamps: true })
export class TrackingLog {
  // Strong Relational Binding to the exact active order
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, unique: true })
  orderId!: Types.ObjectId;

  // Reference back to the driver executing the route
  @Prop({ type: Types.ObjectId, ref: 'Driver', required: true })
  driverId!: Types.ObjectId;

  // The Time-Series Array Bucket
  @Prop({ type: [LocationCoordinate], default: [] })
  coordinates!: LocationCoordinate[];

  @Prop({ required: true, type: Boolean, default: true })
  isActiveStream!: boolean;
}

export type TrackingLogDocument = HydratedDocument<TrackingLog>;
export const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);

// Geospatial and Relational Indexing Optimization
TrackingLogSchema.index({ isActiveStream: 1 });
