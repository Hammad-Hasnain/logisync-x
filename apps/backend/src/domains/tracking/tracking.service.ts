import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackingLog } from './schemas/tracking.schema';
import { Model } from 'mongoose';
import { InitializeTrackingDto } from './dto/initialize-tracking.dto';

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(TrackingLog.name) private readonly trackingLogModel: Model<TrackingLog>,
    ) { }

    async initializeStream(initializeTrackingDto: InitializeTrackingDto): Promise<TrackingLog> {
        const { orderId } = initializeTrackingDto;

        const existingLog = await this.trackingLogModel.findOne({ orderId }).exec();
        if (existingLog) {
            throw new ConflictException('A live telemetry tracking session stream already maps to this order configuration.');
        }

        const newLog = new this.trackingLogModel({
            ...initializeTrackingDto,
            coordinates: [],
            isActiveStream: true,
        });

        return newLog.save();
    }
}
