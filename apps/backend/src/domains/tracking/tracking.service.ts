import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TrackingLog } from './schemas/tracking.schema';
import { Model, Types } from 'mongoose';
import { ClientSession } from 'mongoose';
import { BatchSyncTelemetryDto } from './dto/batch-sync-telemetry.dto';
import Redis from 'ioredis';
import { REDIS_CLIENT } from 'src/infrastructure/redis/redis.constants';
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class TrackingService {
    constructor(
        @InjectModel(TrackingLog.name) private readonly trackingLogModel: Model<TrackingLog>,
        @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    ) { }

    /**
     * Senior Engineer Utility: Unified Key Generator to eliminate hardcoded string risks
     */
    private getCacheKey(orderId: string | Types.ObjectId): string {
        return `tracking:log:${orderId.toString()}`;
    }

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleSafetyBackgroundTelemetryArchival(): Promise<void> {
        console.log('⏰ [LogiSync-X Safety Cron] Initiating time-series data storage syncing sequence...');

        // 1. Scan and retrieve database path matrices for active route streams only
        const activeRouteStreams = await this.trackingLogModel.find({ isActiveStream: true }).lean();

        if (activeRouteStreams.length === 0) return;

        for (const logDoc of activeRouteStreams) {
            const orderIdStr = logDoc.orderId.toString();
            const cacheKey = this.getCacheKey(logDoc.orderId);

            // Fetch current active temporary sets accumulated inside memory grids
            const cachedPointsRaw = await this.redisClient.lrange(cacheKey, 0, -1);

            if (cachedPointsRaw.length > 0) {
                const parsedCoordinatesMapped = cachedPointsRaw.map(pointStr => {
                    const parsed = JSON.parse(pointStr);
                    return {
                        lat: parsed.lat,
                        lng: parsed.lng,
                        timestamp: new Date(parsed.timestamp)
                    };
                });

                // Stream offloading into MongoDB safely inside localized atomic batch updates
                await this.trackingLogModel.updateOne(
                    { orderId: logDoc.orderId },
                    {
                        $push: {
                            coordinates: {
                                $each: parsedCoordinatesMapped
                            }
                        }
                    }
                );

                // Trim Redis cache list memory queue to prevent tracking data duplications over the next interval checks
                // We use LTRIM to keep elements that might have arrived during the processing transaction loop execution
                await this.redisClient.ltrim(cacheKey, cachedPointsRaw.length, -1);
                console.log(`💾 [Cron Auto-Sync Success] Archived ${cachedPointsRaw.length} chunks safely for Order: ${orderIdStr}`);
            }
        }
    }

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

        // Core USP Protocol: If stream turns off (DELIVERED/CANCELLED), dump cache logs safely
        if (!isActiveStream) {
            const cacheKey = this.getCacheKey(orderId);
            const cachedPointsRaw = await this.redisClient.lrange(cacheKey, 0, -1);

            if (cachedPointsRaw.length > 0) {
                const parsedCoordinatesMapped = cachedPointsRaw.map(pointStr => {
                    const parsed = JSON.parse(pointStr);
                    return {
                        lat: parsed.lat,
                        lng: parsed.lng,
                        timestamp: new Date(parsed.timestamp)
                    };
                });

                // Single-pass atomic write block dumping memory sets to hard storage archives
                await this.trackingLogModel.updateOne(
                    { orderId },
                    {
                        $push: {
                            coordinates: {
                                $each: parsedCoordinatesMapped
                            }
                        }
                    }
                );

                // Wipe out cache key from memory grid instantly to secure RAM optimization limits
                await this.redisClient.del(cacheKey);
                console.log(`💾 [LogiSync-X Core Sync] Archived ${cachedPointsRaw.length} points safely from Redis to Mongo for Order: ${orderId.toString()}`);
            }
        }
    }

    /**
     * =========================================================================
     * NEW MILESTONE 1 ACTION: Online Socket Emits Handler (Zero Database Overhead)
     * =========================================================================
     */
    async pushTelemetryToCache(orderId: string, lat: number, lng: number, timestamp: string): Promise<any> {
        const targetOrderId = new Types.ObjectId(orderId);

        // Safety Gate: Verify validation states inside MongoDB before capturing stream packets
        const logDoc = await this.trackingLogModel.findOne({ orderId: targetOrderId });
        if (!logDoc) {
            throw new NotFoundException('Telemetry tracking tracking path anchor ledger record not found.');
        }
        if (!logDoc.isActiveStream) {
            throw new BadRequestException('Streaming denied. The specified telemetry channel trace sequence stream is closed.');
        }

        const cacheKey = this.getCacheKey(orderId);
        const coordinatePayload = JSON.stringify({ lat, lng, timestamp });

        // Linearly append coordinate vectors directly to Redis high-speed list memory queue
        await this.redisClient.rpush(cacheKey, coordinatePayload);
        return { lat, lng, timestamp };
    }



    /**
      * Refactored Milestone 2 Target: Pipes mobile offline blocks into the Redis queue for sequence integrity
      */
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

        // Bulletproof Senior Move: Serialize elements into clean layout strings to pass down our sequential Redis List queue
        const serializedCoordinates = coordinates.map(point => JSON.stringify({
            lat: point.lat,
            lng: point.lng,
            timestamp: point.timestamp
        }));

        const cacheKey = this.getCacheKey(orderId);

        // Atomic multi-argument right push operation bypasses loops memory leaks
        await this.redisClient.rpush(cacheKey, ...serializedCoordinates);

        return {
            message: 'Localized offline mobile buffering metrics synced safely to our memory sequence queue layers.',
            pointsSynced: coordinates.length
        };
    }

    /**
     * Added Helper Method for Milestone 3: Reads transient cache logs
     */
    async getRedisCacheCoordinates(orderId: string): Promise<any[]> {
        const cacheKey = this.getCacheKey(orderId);
        const rawPoints = await this.redisClient.lrange(cacheKey, 0, -1);
        return rawPoints.map(p => JSON.parse(p));
    }

    // Add this explicit collection lookup method inside your TrackingService class
    async getMongoStoredCoordinates(orderId: string): Promise<any> {
        const targetOrderId = new Types.ObjectId(orderId);

        // Read clean isolated historical tracking log document directly from MongoDB disk architectures
        return await this.trackingLogModel.findOne({ orderId: targetOrderId }).lean();
    }

}
