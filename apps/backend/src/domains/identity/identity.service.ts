import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession, Error } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Identity, IdentityDocument } from './schemas/identity.schema';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { LoginDriverDto } from '../drivers/dto/login-driver.dto';

@Injectable()
export class IdentityService {
    constructor(
        @InjectModel(Identity.name) private readonly identityModel: Model<IdentityDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async createIdentity(
        createIdentityDto: CreateIdentityDto,
        session?: ClientSession,
    ): Promise<IdentityDocument> {
        const { email, password, phone, role } = createIdentityDto;

        const existing = await this.identityModel
            .findOne({ email })
            .session(session ?? null);

        if (existing) {
            throw new ConflictException('An authentication identity with this email address already exists.');
        }

        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const [identity] = await this.identityModel.create(
            [
                {
                    email,
                    passwordHash,
                    phone,
                    roles: [role],
                    status: IdentityStatus.ACTIVE,
                    lastLoginAt: new Date()
                },
            ],
            { session },
        );

        return identity;
    }

    async login(loginDto: LoginDriverDto): Promise<{ accessToken: string, identity: IdentityDocument }> {
        try {
            const { email, password } = loginDto;

            const identity = await this.identityModel.findOne({ email }).select('+passwordHash').exec();

            if (!identity || identity.status !== IdentityStatus.ACTIVE) {
                throw new UnauthorizedException('Invalid login credentials or your security profile is locked.');
            }

            const isPasswordMatching = await bcrypt.compare(password, identity.passwordHash);
            if (!isPasswordMatching) {
                throw new UnauthorizedException('Invalid login credentials provided.');
            }

            const tokenPayload = { sub: identity._id, email: identity.email, roles: identity.roles, status: identity.status };
            const accessToken = await this.jwtService.signAsync(tokenPayload);

            return { accessToken, identity };

        } catch (error) {
            console.error(`Message: ${(error as Error).message}`);
            throw error;
        }
    }

}
