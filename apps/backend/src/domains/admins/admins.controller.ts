import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminsService } from './admins.service';
import { JwtAuthGuard } from '../identity/guards/jwt-auth.guard';

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Post()
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminsService.createAdmin(createAdminDto);
    }

    // @UseGuards(JwtAuthGuard)
    @Get('dashboard/analytics')
    async getDashboardAnalytics() {
        return this.adminsService.getDashboardAnalytics();
    }
}
