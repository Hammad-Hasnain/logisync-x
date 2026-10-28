import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Post()
    async createAdmin(@Body() createAdminDto: CreateAdminDto) {
        return this.adminsService.createAdmin(createAdminDto);
    }
}
