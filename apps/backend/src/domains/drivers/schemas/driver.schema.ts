import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// precise structural states for a Driver fleet lifecycle
export enum DriverStatus {
    AVAILABLE = 'AVAILABLE',
    ON_TRIP = 'ON_TRIP',
    OFFLINE = 'OFFLINE'
}

@Schema({ timestamps: true }) // Automatic createdAt and updatedAt injections
export class Driver extends Document {
    @Prop({ required: true, trim: true })
    name!: string;

    @Prop({ required: true, unique: true, lowercase: true, trim: true })
    email!: string;

    @Prop({ required: true, minlength: 6 })
    passwordHash!: string;

    @Prop({ required: true, enum: Object.values(DriverStatus), default: DriverStatus.OFFLINE })
    status!: DriverStatus;

    @Prop({ type: String, default: null })
    currentVehicleNumber!: string | null;
}

//  Compile the exact Mongoose Schema instance mapping
export const DriverSchema = SchemaFactory.createForClass(Driver);

