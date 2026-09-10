import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { Role } from 'src/shared/enums/role.enum';

export type IdentityDocument = HydratedDocument<Identity>;

@Schema({ timestamps: true })
export class Identity {
    @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
    email!: string;

    @Prop({ required: true, select: false })
    passwordHash!: string;

    @Prop({ required: true, trim: true })
    phone!: string;

    @Prop({ required: true, type: [String], enum: Role, index: true })
    roles!: Role[];

    @Prop({ required: true, enum: IdentityStatus, default: IdentityStatus.PENDING })
    status!: IdentityStatus;

    @Prop()
    lastLoginAt?: Date;
}

export const IdentitySchema = SchemaFactory.createForClass(Identity);