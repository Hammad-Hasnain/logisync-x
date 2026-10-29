import { forwardRef, Module } from '@nestjs/common';
import { AdminsController } from './admins.controller';
import { AdminsService } from './admins.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Admin, AdminSchema } from './schemas/admin.schema';
import { IdentityModule } from '../identity/identity.module';
import { DriversModule } from '../drivers/drivers.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    forwardRef(() => IdentityModule),
    forwardRef(() => DriversModule),
    forwardRef(() => OrdersModule),

  ],

  controllers: [AdminsController],
  providers: [AdminsService],
  exports: [AdminsService]
})
export class AdminsModule { }
