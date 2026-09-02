import { Body, Controller, Post, Patch, Param } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { Driver } from './schemas/driver.schema';
import { LoginDriverDto } from './dto/login-driver.dto';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post('signup')
    async signUp(@Body() createDriverDto: CreateDriverDto): Promise<Driver> {
        return this.driversService.create(createDriverDto);
    }

    @Patch(':id/status')
    async toggleStatus(
        @Param('id') id: string,
        @Body() updateDriverStatusDto: UpdateDriverStatusDto,
    ): Promise<Driver> {
        return this.driversService.updateStatus(id, updateDriverStatusDto);
    }

    @Post('login')
    async logIn(@Body() loginDriverDto: LoginDriverDto): Promise<{ accessToken: string; driver: Partial<Driver> }> {
        return this.driversService.login(loginDriverDto);
    }
}



