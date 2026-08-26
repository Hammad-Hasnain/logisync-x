import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingLog, TrackingLogSchema } from './schemas/tracking.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrackingLog.name, schema: TrackingLogSchema }])
  ],
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService],
})
export class TrackingModule { }
