import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DriversModule } from './domains/drivers/drivers.module';
import { OrdersModule } from './domains/orders/orders.module';
import { TrackingModule } from './domains/tracking/tracking.module';

@Module({
  imports: [DriversModule, OrdersModule, TrackingModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
