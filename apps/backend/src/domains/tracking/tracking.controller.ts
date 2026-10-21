import { Body, Controller, NotFoundException, Param, Get, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { BatchSyncTelemetryDto } from './dto/batch-sync-telemetry.dto';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) { }

    // @Post('batch-sync')
    // async processTelemetryBatchSync(
    //     @Body() batchSyncTelemetryDto: BatchSyncTelemetryDto
    // ): Promise<{ message: string; pointsSynced: number }> {
    //     return this.trackingService.processTelemetryBatchSync(batchSyncTelemetryDto);
    // }

    @Post('batch-sync')
    async handleOfflineBatchSync(@Body() batchSyncTelemetryDto: BatchSyncTelemetryDto) {
        return await this.trackingService.processTelemetryBatchSync(batchSyncTelemetryDto);
    }

    // =========================================================================
    // MILESTONE 3 GATEWAY: Real-Time Historical Route Recovery API
    // Target Endpoint URL: http://localhost:3000/api/v1/tracking/history/:orderId
    // =========================================================================
    @Get('history/:orderId')
    async handleGetHistoricalRoute(@Param('orderId') orderId: string) {
        // 1. Extract archived base historical track from MongoDB Atlas
        const mongoTrajectoryLog = await this.trackingService.getMongoStoredCoordinates(orderId);

        // 2. Extract active volatile telemetry points queue straight from Redis Cache Grid
        const redisTransientLog = await this.trackingService.getRedisCacheCoordinates(orderId);

        // System Edge Guard: Reject request early if target order has zero traces tracking log nodes
        if (!mongoTrajectoryLog && redisTransientLog.length === 0) {
            throw new NotFoundException('No active telemetry data patterns recorded for this tracking path target.');
        }

        const archivedCoordinatesBase = mongoTrajectoryLog?.coordinates || [];

        // 3. Senior Engineer Stitching Move: Blend both data layers inside a single flat payload array matrix
        const integratedTrajectoryArray = [
            ...archivedCoordinatesBase.map((point: any) => ({
                lat: point.lat,
                lng: point.lng,
                timestamp: point.timestamp,
            })),
            ...redisTransientLog,
        ];

        // 4. Critical Resolution Step: Chronological time-series ordering sorting algorithm using timestamp vectors
        const sortedTrajectoryOutput = integratedTrajectoryArray.sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );

        return {
            success: true,
            message: 'Historical dynamic route trajectory stitched and retrieved successfully.',
            data: {
                orderId,
                totalPointsCaptured: sortedTrajectoryOutput.length,
                coordinates: sortedTrajectoryOutput,
            },
        };
    }
}
