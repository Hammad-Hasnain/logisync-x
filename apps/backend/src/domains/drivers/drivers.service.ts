import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Driver } from './schemas/driver.schema';
import { Model } from 'mongoose';
import { CreateDriverDto } from './dto/create-driver.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DriversService {
    constructor(
        @InjectModel(Driver.name) private readonly driverModel: Model<Driver>,
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
}
