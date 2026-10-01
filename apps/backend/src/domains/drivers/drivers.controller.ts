import { Body, Controller, Post, Patch, Param, UseGuards, Get } from '@nestjs/common';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { DriverDocument } from './schemas/driver.schema';
import { LoginDriverDto } from './dto/login-driver.dto';
import { UpdateIdentityStatusDto } from './dto/update-identity-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Post('signup')
    async signUp(@Body() createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        return this.driversService.create(createDriverDto);
    }

    @Post('login')
    async logIn(@Body() loginDriverDto: LoginDriverDto): Promise<{ accessToken: string; driver: DriverDocument }> {
        return this.driversService.login(loginDriverDto);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll() {
        return this.driversService.findAll();
    }

    @Get('lookup')
    @UseGuards(AuthGuard('jwt'))
    async lookup() {
        return this.driversService.findLookupList();
    }

    @Get(':id')
    @UseGuards(AuthGuard('jwt'))
    async findById(@Param('id') id: string) {
        return this.driversService.findById(id);
    }

    @Patch(':id/fleet-status')
    async toggleStatus(
        @Param('id') id: string,
        @Body() updateDriverStatusDto: UpdateDriverStatusDto,
    ): Promise<DriverDocument> {
        return this.driversService.updateFleetStatus(id, updateDriverStatusDto);
    }

    @Patch(':id/identity-status')
    @UseGuards(AuthGuard('jwt'))
    async updateIdentityStatus(@Param('id') id: string, @Body() dto: UpdateIdentityStatusDto) {
        return this.driversService.updateIdentityStatus(id, dto.status);
    }


    @Patch(':id')
    @UseGuards(AuthGuard('jwt'))
    async update(@Param('id') id: string, @Body() dto: UpdateDriverDto) {
        return this.driversService.update(id, dto);
    }
}



