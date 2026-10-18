import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Identity, IdentitySchema } from './schemas/identity.schema';
import { IdentityService } from './identity.service';
import { SignOptions } from 'jsonwebtoken';
import { IdentityController } from './identity.controller';
import { AdminsModule } from '../admins/admins.module';
import { DriversModule } from '../drivers/drivers.module';


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

        forwardRef(() => AdminsModule),
        forwardRef(() => DriversModule),
    ],
    providers: [IdentityService],
    controllers: [IdentityController],
    exports: [IdentityService, JwtModule, PassportModule],
})
export class IdentityModule { }
