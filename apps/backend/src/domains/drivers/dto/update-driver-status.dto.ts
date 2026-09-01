import { IsEnum, IsNotEmpty } from 'class-validator';
import { DriverStatus } from '../schemas/driver.schema';

export class UpdateDriverStatusDto {
    @IsEnum(DriverStatus, {
        message: 'Status parameters must strictly be either AVAILABLE, ON_TRIP, or OFFLINE.'
    })
    @IsNotEmpty({ message: 'Driver status property cannot be empty.' })
    status!: DriverStatus;
}
