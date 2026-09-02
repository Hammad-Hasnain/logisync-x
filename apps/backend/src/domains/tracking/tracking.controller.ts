import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InitializeTrackingDto } from './dto/initialize-tracking.dto';
import { TrackingLog } from './schemas/tracking.schema';
import { TrackingService } from './tracking.service';
import { PushCoordinateDto } from './dto/push-coordinate.dto';
// import { AuthGuard } from '@nestjs/passport';

@Controller('tracking')
export class TrackingController {
    constructor(private readonly trackingService: TrackingService) { }

    @Post('init')
    async initializeTracking(@Body() initializeTrackingDto: InitializeTrackingDto): Promise<TrackingLog> {
        return this.trackingService.initializeStream(initializeTrackingDto);
    }

    @Post('push')
    // @UseGuards(AuthGuard('jwt'))
    async appendCoordinate(@Body() pushCoordinateDto: PushCoordinateDto): Promise<TrackingLog> {
        return this.trackingService.pushLocation(pushCoordinateDto);
    }
}
