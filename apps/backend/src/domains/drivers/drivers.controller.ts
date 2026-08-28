import { Body, Controller, Post } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { Driver } from './schemas/driver.schema';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post('signup')
    async signUp(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
        return this.driversService.create(createDriverDto);
    }
}
