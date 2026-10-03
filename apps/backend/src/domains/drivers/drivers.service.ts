import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Connection, ClientSession } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';
import { Driver, DriverDocument } from './schemas/driver.schema';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { IdentityService } from '../identity/identity.service';
import { FleetStatus } from 'src/shared/enums/fleet-status.enum';
import { Role } from 'src/shared/enums/role.enum';
import { DriverResponseDto } from './dto/driver-response.dto';
import { IdentityDocument } from '../identity/schemas/identity.schema';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { UpdateDriverDto } from './dto/update-driver.dto';

@Injectable()
export class DriversService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
        private readonly identityService: IdentityService,
        @InjectConnection() private readonly connection: Connection,

    ) { }

    private toResponseDto(driver: DriverDocument): DriverResponseDto {
        const identity = driver.identityId as unknown as IdentityDocument;

        return {
            id: driver._id.toString(),
            identityId: identity._id.toString(),
            name: driver.name,
            email: identity.email,
            phone: identity.phone,
            licenseNumber: driver.licenseNumber,
            vehicleNumber: driver.vehicleNumber,
            fleetStatus: driver.fleetStatus,
            identityStatus: identity.status,
        };
    }


    async create(createDriverDto: CreateDriverDto): Promise<DriverDocument> {
        const { name, email, password, phone, licenseNumber, vehicleNumber } = createDriverDto;

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
                    vehicleNumber,
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

    async findAll(): Promise<DriverResponseDto[]> {
        const drivers = await this.driverModel.find().populate('identityId').exec();
        return drivers.map((d) => this.toResponseDto(d));
    }

    async findById(id: string): Promise<DriverResponseDto> {
        const driver = await this.driverModel.findById(id).populate('identityId').exec();
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return this.toResponseDto(driver);
    }

    async findByIdWithSession(id: string, session: ClientSession): Promise<DriverDocument> {
        const driver = await this.driverModel.findById(id).session(session);
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return driver;
    }

    async findLookupList() {
        return this.driverModel
            .find({ fleetStatus: FleetStatus.ONLINE })
            .select('_id name')
            .exec();
    }

    async updateIdentityStatus(driverId: string, status: IdentityStatus): Promise<DriverResponseDto> {
        const driver = await this.driverModel.findById(driverId);
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        await this.identityService.updateStatus(driver.identityId.toString(), status);

        const updated = await this.driverModel.findById(driverId).populate('identityId').exec();
        return this.toResponseDto(updated!);
    }

    async update(id: string, dto: UpdateDriverDto): Promise<DriverResponseDto> {
        const driver = await this.driverModel.findByIdAndUpdate(id, dto, { returnDocument: 'after', runValidators: true });

        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        const populated = await this.driverModel.findById(id).populate('identityId').exec();
        return this.toResponseDto(populated!);
    }

    async updateFleetStatus(
        driverId: string,
        updateDriverStatusDto: UpdateDriverStatusDto,
        session?: ClientSession
    ): Promise<DriverDocument> {
        const { status } = updateDriverStatusDto;

        const updatedDriver = await this.driverModel.findByIdAndUpdate(
            driverId,
            { fleetStatus: status },
            {
                returnDocument: 'after',
                runValidators: true,
                session
            }
        ).exec();

        if (!updatedDriver) {
            throw new NotFoundException('No registered fleet unit matches this identity.');
        }

        return updatedDriver;
    }

}
