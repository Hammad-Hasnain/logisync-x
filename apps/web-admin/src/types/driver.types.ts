import { DutyStatus } from '@/enums/duty-status.enum';
import { IdentityStatus } from '@/enums/identity-status.enum';

export interface CreateDriverPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    licenseNumber: string;
    vehicleNumber: string;
}

export interface UpdateDriverPayload {
    name: string;
    licenseNumber: string;
    vehicleNumber: string;
}

export interface Driver {
    id: string;
    identityId: string;
    name: string;
    email: string;
    phone: string;
    licenseNumber: string;
    vehicleNumber: string;
    fleetStatus: DutyStatus;
    identityStatus: IdentityStatus;
}

export interface DriverLookup {
    id: string;
    name: string;
    dutyStatus: DutyStatus;
}