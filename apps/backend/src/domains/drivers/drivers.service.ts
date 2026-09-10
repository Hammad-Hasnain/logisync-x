import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { IdentityService } from '../identity/identity.service';
import { FleetStatus } from 'src/shared/enums/fleet-status.enum';
import { Role } from 'src/shared/enums/role.enum';

@Injectable()
export class DriversService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
        private readonly identityService: IdentityService,
        @InjectConnection() private readonly connection: Connection,
    ) { }

    async create(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        const { name, email, password, phone, licenseNumber, currentVehicleNumber } = createDriverDto;

        const session = await this.connection.startSession();
        let savedDriver: DriverDocument | null = null;

        try {
            await session.withTransaction(async () => {

                const identityRecord = await this.identityService.createIdentity(
                    {
                        email,
                        password,
                        phone,
                        role: Role.DRIVER
                    },
                    session,
                );

                const newDriver = new this.driverModel({
                    identityId: identityRecord._id,
                    name,
                    licenseNumber,
                    currentVehicleNumber,
                    fleetStatus: FleetStatus.OFFLINE,
                });

                const result = await newDriver.save({ session });
                savedDriver = result as DriverDocument;
            });

            if (!savedDriver) {
                throw new InternalServerErrorException('Transaction runtime mismatch: Database profile initialization collapsed.');
            }

            return savedDriver;

        } catch (error) {
            throw new InternalServerErrorException(
                `Onboarding Profile Deployment Aborted Natively: ${(error as Error).message}`
            );
        } finally {
            await session.endSession();
        }
    }

    async login(loginDriverDto: LoginDriverDto): Promise<{ accessToken: string; driver: DriverDocument }> {
        const { accessToken, identity } = await this.identityService.login(loginDriverDto);

        const driverProfile = await this.driverModel.findOne({ identityId: identity._id }).exec();
        if (!driverProfile) {
            throw new NotFoundException('Authentication handshake approved but no rich profile parameters exist.');
        }

        return {
            accessToken,
            driver: driverProfile,
        };
    }

    async updateStatus(driverId: string, updateDriverStatusDto: UpdateDriverStatusDto): Promise<Driver> {
        const { status } = updateDriverStatusDto;
        const updatedDriver = await this.driverModel.findByIdAndUpdate(
            driverId,
            { fleetStatus: status as any }, // Maps to your target fleet status schema mutations
            { new: true, runValidators: true }
        ).exec();
        if (!updatedDriver) {
            throw new NotFoundException('No registered fleet unit matches this identity.');
        }
        return updatedDriver;
    }

    async findAll(): Promise<Driver[]> {
        return this.driverModel.find().exec();
    }
}
