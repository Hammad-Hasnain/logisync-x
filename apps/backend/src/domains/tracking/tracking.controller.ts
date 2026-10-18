import { Body, Controller, Post } from '@nestjs/common';
import { TrackingService } from './tracking.service';
import { BatchSyncTelemetryDto } from './dto/batch-sync-telemetry.dto';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) { }

    @Post('batch-sync')
    async processTelemetryBatchSync(
        @Body() batchSyncTelemetryDto: BatchSyncTelemetryDto
    ): Promise<{ message: string; pointsSynced: number }> {
        return this.trackingService.processTelemetryBatchSync(batchSyncTelemetryDto);
    }
}
