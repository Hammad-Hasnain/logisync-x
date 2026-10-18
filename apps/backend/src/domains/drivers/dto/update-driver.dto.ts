import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class UpdateDriverDto {
    @IsOptional()
    @IsString({ message: 'Driver profile name must contain plain standard alphabetic character variables.' })
    name?: string;

    @IsOptional()
    @IsString({ message: 'Primary contact phone sequence must be a valid numeric text format.' })
    phone?: string;

    @IsOptional()
    @IsString({ message: 'Vehicle registration plate number indicator must be alphanumeric text.' })
    vehicleNumber?: string;

    @IsOptional()
    @IsEnum(DutyStatus, { message: 'Provided active duty state level must match valid duty options.' })
    dutyStatus?: DutyStatus;

    @IsOptional()
    @IsEnum(IdentityStatus, { message: 'Provided configuration level status must follow standard identity states.' })
    status?: IdentityStatus;
}
