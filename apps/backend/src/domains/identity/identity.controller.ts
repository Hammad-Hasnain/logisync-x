import { Body, Controller, Post } from '@nestjs/common';
import { IdentityService } from './identity.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponse } from './interfaces/login-response.interface';

@Controller('identity')
export class IdentityController {
    constructor(private readonly identityService: IdentityService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
        return await this.identityService.validateAndLogin(loginDto);
    }
}
