import { IsEnum, IsNotEmpty } from 'class-validator';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

export class UpdateDriverStatusDto {
    @IsEnum(DutyStatus, {
        message: 'Status parameters must strictly be either AVAILABLE, ON_TRIP, or OFFLINE.'
    })
    @IsNotEmpty({ message: 'Driver status property cannot be empty.' })
    status!: DutyStatus;
}
