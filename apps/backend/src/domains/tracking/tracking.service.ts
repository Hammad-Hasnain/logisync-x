import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackingLog } from './schemas/tracking.schema';
import { Model, Mongoose, Types } from 'mongoose';
import { InitializeTrackingDto } from './dto/initialize-tracking.dto';
import { PushCoordinateDto } from './dto/push-coordinate.dto';
import { ClientSession } from 'mongoose';
import { BatchSyncTelemetryDto } from './dto/batch-sync-telemetry.dto';

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(TrackingLog.name) private readonly trackingLogModel: Model<TrackingLog>,
    ) { }

    async initializeTrackingLog(
        orderId: Types.ObjectId,
        driverId: Types.ObjectId,
        session: ClientSession
    ): Promise<void> {
        await this.trackingLogModel.updateOne(
            { orderId },
            {
                $set: { driverId },
                $setOnInsert: { coordinates: [], isActiveStream: false }
            },
            { upsert: true, session }
        );
    }

    async toggleStreamActivity(orderId: Types.ObjectId, isActiveStream: boolean): Promise<void> {
        await this.trackingLogModel.updateOne(
            { orderId },
            { $set: { isActiveStream } }
        );
    }

    async processTelemetryBatchSync(batchSyncTelemetryDto: BatchSyncTelemetryDto): Promise<{ message: string; pointsSynced: number }> {
        const { orderId, coordinates } = batchSyncTelemetryDto;

        const targetOrderId = new Types.ObjectId(orderId);

        const logDoc = await this.trackingLogModel.findOne({ orderId: targetOrderId });
        if (!logDoc) {
            throw new NotFoundException('Telemetry tracking tracking path anchor ledger record not found.');
        }

        if (!logDoc.isActiveStream) {
            throw new BadRequestException('Synchronizing payloads denied. The specified telemetry channel trace sequence stream is closed.');
        }

        if (coordinates.length === 0) {
            return { message: 'Zero buffer parameters telemetry data frames updated.', pointsSynced: 0 };
        }

        const localizedCoordinatesMapped = coordinates.map(point => ({
            lat: point.lat,
            lng: point.lng,
            timestamp: new Date(point.timestamp)
        }));

        await this.trackingLogModel.updateOne(
            { orderId: targetOrderId },
            {
                $push: {
                    coordinates: {
                        $each: localizedCoordinatesMapped
                    }
                }
            }
        );

        return {
            message: 'Localized offline mobile buffering metrics synced safely to cloud storage architectures.',
            pointsSynced: coordinates.length
        };
    }
}
