import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Identity, IdentitySchema } from './schemas/identity.schema';
import { IdentityService } from './identity.service';
import { SignOptions } from 'jsonwebtoken';


interface EnvironmentVariables {
    JWT_SECRET: string;
    JWT_EXPIRATION: SignOptions['expiresIn'];
}

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Identity.name, schema: IdentitySchema }]),
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService<EnvironmentVariables>) => ({
                secret: configService.get('JWT_SECRET', { infer: true }),
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRATION', { infer: true }),
                },
            }),
        }),
    ],
    providers: [IdentityService],
    exports: [IdentityService, JwtModule, PassportModule],
})
export class IdentityModule { }
