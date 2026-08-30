import { Body, Controller, Post } from '@nestjs/common';
import { InitializeTrackingDto } from './dto/initialize-tracking.dto';
import { TrackingLog } from './schemas/tracking.schema';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) { }

    @Post('init')
    async initializeTracking(@Body() initializeTrackingDto: InitializeTrackingDto): Promise<TrackingLog> {
        return this.trackingService.initializeStream(initializeTrackingDto);
    }
}
