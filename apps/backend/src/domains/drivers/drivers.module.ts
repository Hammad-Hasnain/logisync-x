import { Module } from '@nestjs/common';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Driver, DriverSchema } from './schemas/driver.schema';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IdentityModule } from '../identity/identity.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Driver.name, schema: DriverSchema }]),
    IdentityModule,
  ],
  controllers: [DriversController],
  providers: [DriversService, JwtStrategy],
  exports: [DriversService],
})
export class DriversModule { }
