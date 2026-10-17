import { FleetStatus } from 'src/shared/enums/duty-status.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';

export class DriverResponseDto {
    id!: string;
    identityId!: string;
    name!: string;
    email!: string;
    phone!: string;
    licenseNumber!: string;
    vehicleNumber!: string;
    fleetStatus!: FleetStatus;
    identityStatus!: IdentityStatus;
}