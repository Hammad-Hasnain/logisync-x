import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminDocument } from './schemas/admin.schema';
import { AdminsService } from './admins.service';
import { LoginAdminDto } from './dto/login-admin.dto';

@Controller('admins')
export class AdminsController {
    constructor(private readonly adminsService: AdminsService) { }

    @Post('signup')
    async signUp(@Body() createAdminDto: CreateAdminDto): Promise<AdminDocument> {
        return this.adminsService.create(createAdminDto);
    }

    @Post('login')
    async login(@Body() loginAdminDto: LoginAdminDto): Promise<{ accessToken: string; admin: AdminDocument }> {
        return this.adminsService.login(loginAdminDto)
    }

}
