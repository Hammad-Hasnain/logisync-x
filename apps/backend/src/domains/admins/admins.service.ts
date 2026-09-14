import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { IdentityService } from '../identity/identity.service';
import { Connection, Model } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from 'src/shared/enums/role.enum';
import { LoginAdminDto } from './dto/login-admin.dto';
import { toResponseId } from 'src/shared/utils/to-response-id.util';
import { AdminResponseDto } from './dto/admin-response.dto';

@Injectable()
export class AdminsService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        private readonly identityService: IdentityService,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async create(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
        const { name, email, password, phone } = createAdminDto;

        const session = await this.connection.startSession();
        let savedAdmin: AdminDocument | null = null;

        try {
            await session.withTransaction(async () => {

                const identityRecord = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.ADMIN
                    },
                    session,
                );

                const newAdmin = new this.adminModel({
                    identityId: identityRecord._id,
                    name,
                });

                const result = await newAdmin.save({ session });
                savedAdmin = result as AdminDocument;
            });

            if (!savedAdmin) {
                throw new InternalServerErrorException('Transaction runtime mismatch: Database profile initialization collapsed.');
            }

            return savedAdmin;

        } catch (error) {
            throw new InternalServerErrorException(
                `Onboarding Profile Deployment Aborted Natively: ${(error as Error).message}`
            );
        } finally {
            await session.endSession();
        }
    }

    async login(loginAdminDto: LoginAdminDto): Promise<{ accessToken: string; admin: AdminResponseDto }> {
        const { accessToken, identity } = await this.identityService.login(loginAdminDto);

        const adminProfile = await this.adminModel.findOne({ identityId: identity._id }).exec();
        if (!adminProfile) {
            throw new NotFoundException('Authentication handshake approved but no rich profile parameters exist.');
        }

        const admin: AdminResponseDto = {
            id: toResponseId(adminProfile),
            identityId: toResponseId(identity),
            name: adminProfile.name,
            email: identity.email,
            roles: identity.roles,
            status: identity.status,
            phone: identity.phone,
        };


        return {
            accessToken,
            admin,
        };
    }
}

