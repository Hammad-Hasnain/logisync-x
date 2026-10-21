import { Module } from '@nestjs/common';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TrackingLog, TrackingLogSchema } from './schemas/tracking.schema';
import { JwtStrategy } from '../drivers/strategies/jwt.strategy';
import { DriversModule } from '../drivers/drivers.module';
import { TrackingGateway } from './tracking.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrackingLog.name, schema: TrackingLogSchema }]),
    DriversModule
  ],
  controllers: [TrackingController],
  providers: [TrackingService, JwtStrategy, TrackingGateway],
  exports: [TrackingService],
})
export class TrackingModule { }
