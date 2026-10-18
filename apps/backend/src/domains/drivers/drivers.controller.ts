import { Body, Controller, Post, Param, Get, Patch, Delete } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverDocument } from './schemas/driver.schema';
import { IDriverResponse } from './interface/driver-response.interface';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { IDriverDropdownResponse } from './interface/driver-dropdown-response.interface';

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

    @Get('dropdown')
    async getDriversDropdown(): Promise<IDriverDropdownResponse[]> {
        return this.driversService.getDriversDropdown();
    }

    @Get(':id')
    async findDriverById(@Param('id') id: string): Promise<IDriverResponse> {
        return this.driversService.findDriverById(id);
    }

    @Patch(':id')
    async updateDriver(
        @Param('id') id: string,
        @Body() updateDriverDto: UpdateDriverDto
    ): Promise<IDriverResponse> {
        return this.driversService.updateDriver(id, updateDriverDto);
    }

    @Delete(':id')
    async deleteDriver(@Param('id') id: string): Promise<{ message: string }> {
        return this.driversService.deleteDriver(id);
    }


}



