import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schemas/admin.schema';
import { IdentityService } from '../identity/identity.service';
import { Connection, Model, Types } from 'mongoose';
import { CreateAdminDto } from './dto/create-admin.dto';
import { Role } from 'src/shared/enums/role.enum';
import { OrdersService } from '../orders/orders.service';
import { DriversService } from '../drivers/drivers.service';

@Injectable()
export class AdminsService {
    constructor(
        @InjectModel(Admin.name) private readonly adminModel: Model<Admin>,
        @Inject(forwardRef(() => IdentityService)) private readonly identityService: IdentityService,
        @Inject(forwardRef(() => DriversService)) private readonly driversService: DriversService,
        @Inject(forwardRef(() => OrdersService)) private readonly ordersService: OrdersService,
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

    async getProfileByIdentity(identityId: Types.ObjectId | string): Promise<AdminDocument> {
        const admin = await this.adminModel.findOne({ identityId });
        if (!admin) {
            throw new Error('Admin profile configuration record not found.');
        }
        return admin;
    }

    async getDashboardAnalytics() {
        const [orderAnalytics, driverAnalytics, identityAnalytics] = await Promise.all([
            this.identityService.getIdentityAnalytics(),
            this.driversService.getDriverAnalytics(),
            this.ordersService.getOrderAnalytics(),
        ]);

        return {
            ...identityAnalytics,
            ...driverAnalytics,
            ...orderAnalytics,
        };
    }
}

