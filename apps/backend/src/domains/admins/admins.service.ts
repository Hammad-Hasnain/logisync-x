import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { IdentityService } from '../identity/identity.service';
import { Connection, Model, Types } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class AdminsService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        private readonly identityService: IdentityService,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async createAdmin(createAdminDto: CreateAdminDto): Promise<AdminDocument> {
        const { name, email, password, phone, status } = createAdminDto;

        const session = await this.connection.startSession();
        let adminDocument!: AdminDocument;

        try {
            await session.withTransaction(async () => {
                const identity = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.ADMIN,
                        ...(status && { status })
                    },
                    session,
                );

                const [createdAdmin] = await this.adminModel.create(
                    [
                        {
                            identityId: identity._id,
                            name,
                        },
                    ],
                    { session },
                );

                adminDocument = createdAdmin;
            });
        } finally {
            await session.endSession();
        }

        return adminDocument;
    }

}

