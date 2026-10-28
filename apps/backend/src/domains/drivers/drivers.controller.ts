import { Body, Controller, Post, Param, Get, Patch, Delete, UseGuards } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { DriverDocument } from './schemas/driver.schema';
import { IDriverResponse } from './interface/driver-response.interface';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { IDriverDropdownResponse } from './interface/driver-dropdown-response.interface';
import { IDriverOrderItemResponse } from './interface/driver-orders-response.interface';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post()
    async createDriver(@Body() createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        return this.driversService.createDriver(createDriverDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async findAllDrivers(): Promise<IDriverResponse[]> {
        return this.driversService.findAllDrivers();
    }
    @UseGuards(JwtAuthGuard)
    @Get('dropdown')
    async getDriversDropdown(): Promise<IDriverDropdownResponse[]> {
        return this.driversService.getDriversDropdown();
    }

    @UseGuards(JwtAuthGuard)
    @Get('my-orders/:driverId')
    async getDriverOrders(@Param('driverId') driverId: string): Promise<IDriverOrderItemResponse[]> {
        return this.driversService.getDriverOrders(driverId);
    }


    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findDriverById(@Param('id') id: string): Promise<IDriverResponse> {
        return this.driversService.findDriverById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateDriver(
        @Param('id') id: string,
        @Body() updateDriverDto: UpdateDriverDto
    ): Promise<IDriverResponse> {
        return this.driversService.updateDriver(id, updateDriverDto);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteDriver(@Param('id') id: string): Promise<{ message: string }> {
        return this.driversService.deleteDriver(id);
    }
}



