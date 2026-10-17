import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type TrackingLogDocument = HydratedDocument<TrackingLog>;

@Schema({ _id: false })
export class LocationCoordinate {
  @Prop({ required: true, type: Number })
  lat!: number;

  @Prop({ required: true, type: Number })
  lng!: number;

  @Prop({ required: true, type: Date, default: Date.now })
  timestamp!: Date;
}

@Schema({ timestamps: true })
export class TrackingLog {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, unique: true })
  orderId!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Driver', required: true })
  driverId!: Types.ObjectId;

  @Prop({ type: [LocationCoordinate], default: [] })
  coordinates!: LocationCoordinate[];

  @Prop({ required: true, type: Boolean, default: false, index: true })
  isActiveStream!: boolean;
}

export const TrackingLogSchema = SchemaFactory.createForClass(TrackingLog);

TrackingLogSchema.set('toJSON', {
  transform: (_, ret) => {
    const { _id, __v, ...rest } = ret;

    return {
      id: _id?.toString(),
      ...rest
    };
  }
});
