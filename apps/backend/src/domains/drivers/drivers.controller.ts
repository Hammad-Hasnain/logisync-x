import { Body, Controller, Post, Param, Get } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverDocument } from './schemas/driver.schema';
import { IDriverResponse } from './interface/driver-response.interface';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post()
    async createDriver(@Body() createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        return this.driversService.createDriver(createDriverDto);
    }

    @Get()
    async findAllDrivers(): Promise<IDriverResponse[]> {
        return this.driversService.findAllDrivers();
    }

    @Get(':id')
    async findDriverById(@Param('id') id: string): Promise<IDriverResponse> {
        return this.driversService.findDriverById(id);
    }
}



