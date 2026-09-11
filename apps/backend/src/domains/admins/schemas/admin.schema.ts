import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ timestamps: true })
export class Admin {
    @Prop({ type: Types.ObjectId, required: true, ref: 'Identity', unique: true })
    identityId!: Types.ObjectId;

    @Prop({ required: true, trim: true })
    name!: string;

}

export const AdminSchema = SchemaFactory.createForClass(Admin);
