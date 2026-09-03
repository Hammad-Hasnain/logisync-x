import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './schemas/driver.schema';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as bcrypt from 'bcrypt';
import { UpdateDriverStatusDto } from './dto/update-driver-status.dto';
import { LoginDriverDto } from './dto/login-driver.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class DriversService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
        private readonly jwtService: JwtService
    ) { }

    async create(createDriverDto: CreateDriverDto): Promise<Driver> {
        const { name, email, password } = createDriverDto;

        const existingDriver = await this.driverModel.findOne({ email }).exec();
        if (existingDriver) {
            throw new ConflictException('A driver with this email address is already registered.');
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newDriver = new this.driverModel({
            name,
            email,
            passwordHash,
        });

        return newDriver.save();
    }

    async updateStatus(driverId: string, updateDriverStatusDto: UpdateDriverStatusDto): Promise<Driver> {
        const { status } = updateDriverStatusDto;

        const updatedDriver = await this.driverModel.findByIdAndUpdate(
            driverId,
            { status },
            { returnDocument: 'after', runValidators: true }
        ).exec();

        if (!updatedDriver) {
            throw new NotFoundException('No registered driver found mapping to this identification token.');
        }

        return updatedDriver;
    }

    async login(loginDriverDto: LoginDriverDto): Promise<{ accessToken: string; driver: Partial<Driver> }> {
        const { email, password } = loginDriverDto;

        const driver = await this.driverModel.findOne({ email }).exec();
        if (!driver) {
            throw new UnauthorizedException('Invalid login credentials provided.');
        }

        const isPasswordMatching = await bcrypt.compare(password, driver.passwordHash);
        if (!isPasswordMatching) {
            throw new UnauthorizedException('Invalid login credentials provided.');
        }

        const tokenPayload = { sub: driver._id, email: driver.email };
        const accessToken = await this.jwtService.signAsync(tokenPayload);

        return {
            accessToken,
            driver: {
                _id: driver._id,
                name: driver.name,
                email: driver.email,
                status: driver.status,
            },
        };
    }

}
