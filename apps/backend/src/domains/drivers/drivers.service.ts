import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection, Types } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { IdentityService } from '../identity/identity.service';
import { Role } from 'src/shared/enums/role.enum';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';
import { IDriverResponse } from './interface/driver-response.interface';

@Injectable()
export class DriversService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
        private readonly identityService: IdentityService,
        @InjectConnection() private readonly connection: Connection,

    ) { }

    async createDriver(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        const { name, email, password, phone, vehicleNumber, status } = createDriverDto;

        // LATER: Duplicate vehicle number check before starting transaction to avoid unnecessary session locks
        // const existingVehicle = await this.driverModel.findOne({
        //     vehicleNumber: vehicleNumber.toUpperCase().trim()
        // });
        // if (existingVehicle) {
        //     throw new ConflictException('Fleet operational asset deployment vehicle registration plate already allocated.');
        // }

        const session = await this.connection.startSession();
        let driverDocument!: DriverDocument;

        try {
            await session.withTransaction(async () => {
                // 1. Create centralized core login identity via identityService
                const identity = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.DRIVER,
                        ...(status && { status })
                    },
                    session,
                );

                // 2. Expand profile details inside the drivers collection
                const [createdDriver] = await this.driverModel.create(
                    [
                        {
                            identityId: identity._id,
                            name,
                            vehicleNumber: vehicleNumber.toUpperCase().trim(),
                            dutyStatus: DutyStatus.AVAILABLE, // Initial default state layout
                        },
                    ],
                    { session },
                );

                driverDocument = createdDriver;
            });
        } finally {
            await session.endSession();
        }

        return driverDocument;
    }

    async findAllDrivers(): Promise<IDriverResponse[]> {
        return this.driverModel.aggregate<IDriverResponse>([
            {
                $lookup: {
                    from: 'identities',
                    localField: 'identityId',
                    foreignField: '_id',
                    as: 'identityDetails'
                }
            },
            {
                $unwind: {
                    path: '$identityDetails',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: '$_id' },
                    name: 1,
                    email: '$identityDetails.email',
                    phone: '$identityDetails.phone',
                    status: '$identityDetails.status',
                    role: '$identityDetails.role',
                    vehicleNumber: 1,
                    dutyStatus: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]).exec();
    }

    async getProfileByIdentity(identityId: Types.ObjectId | string): Promise<DriverDocument> {
        const driver = await this.driverModel.findOne({ identityId });
        if (!driver) {
            throw new Error('Driver profile configuration record not found.');
        }
        return driver;
    }

}
