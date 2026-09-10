import { IsEnum, IsNotEmpty } from 'class-validator';
import { FleetStatus } from 'src/shared/enums/fleet-status.enum';

export class UpdateDriverStatusDto {
    @IsEnum(FleetStatus, {
        message: 'Status parameters must strictly be either AVAILABLE, ON_TRIP, or OFFLINE.'
    })
    @IsNotEmpty({ message: 'Driver status property cannot be empty.' })
    status!: FleetStatus;
}
