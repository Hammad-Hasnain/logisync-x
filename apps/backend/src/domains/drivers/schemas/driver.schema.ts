import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { FleetStatus } from 'src/shared/enums/fleet-status.enum';

export type DriverDocument = HydratedDocument<Driver>;

@Schema({ timestamps: true })
export class Driver {
    // THE AUTH BINDING LINK: Reference pointing straight back to the identities collection _id
    @Prop({ type: Types.ObjectId, required: true, ref: 'Identity', unique: true })
    identityId!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name!: string;

    @Prop({ required: true, trim: true })
    licenseNumber!: string;

    @Prop({ required: true, trim: true })
    currentVehicleNumber!: string;

    @Prop({
        type: String,
        enum: Object.values(FleetStatus),
        default: FleetStatus.OFFLINE
    })
    fleetStatus!: FleetStatus;
}

export const DriverSchema = SchemaFactory.createForClass(Driver);
