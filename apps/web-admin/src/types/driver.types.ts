import { FleetStatus } from '@/enums/fleet-status.enum';
import { IdentityStatus } from '@/enums/identity-status.enum';

export interface Driver {
    id: string;
    identityId: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    vehicleNumber: string;
    fleetStatus: FleetStatus;
    identityStatus: IdentityStatus;
}

export interface DriverLookup {
    id: string;
    name: string;
}