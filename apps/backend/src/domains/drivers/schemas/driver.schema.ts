import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ timestamps: true })
export class Driver {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Identity', unique: true })
    identityId!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name!: string;

    @Prop({ required: true, trim: true })
    vehicleNumber!: string;

    @Prop({
        type: String,
        enum: DutyStatus,
        default: DutyStatus.AVAILABLE
    })
    dutyStatus!: DutyStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);


DriverSchema.set('toJSON', {
    transform: (_, ret) => {
        const { _id, __v, ...rest } = ret;

        return {
            id: _id?.toString(),
            ...rest
        };
    }
});