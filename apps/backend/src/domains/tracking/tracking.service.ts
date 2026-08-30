import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackingLog } from './schemas/tracking.schema';
import { Model, Mongoose, Types } from 'mongoose';
import { InitializeTrackingDto } from './dto/initialize-tracking.dto';
import { PushCoordinateDto } from './dto/push-coordinate.dto';

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(TrackingLog.name) private readonly trackingLogModel: Model<TrackingLog>,
    ) { }

    async initializeStream(initializeTrackingDto: InitializeTrackingDto): Promise<TrackingLog> {
        const { orderId, driverId } = initializeTrackingDto;

        const existingLog = await this.trackingLogModel.findOne({ orderId: new Types.ObjectId(orderId) }).exec();

        if (existingLog) {
            throw new ConflictException('A live telemetry tracking session stream already maps to this order configuration.');
        }

        const newLog = new this.trackingLogModel({
            orderId: new Types.ObjectId(orderId),
            driverId: new Types.ObjectId(driverId),
            coordinates: [],
            isActiveStream: true,
        });

        return newLog.save();
    }

    async pushLocation(pushCoordinateDto: PushCoordinateDto): Promise<TrackingLog> {
        const { orderId, latitude, longitude } = pushCoordinateDto;

        // Core Architectural Query: Find the active log session and atomically push the nested object
        const updatedLog = await this.trackingLogModel.findOneAndUpdate(
            {
                orderId: new Types.ObjectId(orderId),
                isActiveStream: true
            },
            {
                $push: {
                    coordinates: {
                        latitude,
                        longitude,
                        timestamp: new Date()
                    }
                }
            },
            { new: true }
        ).exec();

        if (!updatedLog) {
            throw new NotFoundException('No active tracking log stream found mapping to this Order reference.');
        }

        return updatedLog;
    }
}
