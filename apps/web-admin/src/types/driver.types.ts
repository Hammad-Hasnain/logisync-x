import { DutyStatus } from '@/enums/duty-status.enum';
import { IdentityStatus } from '@/enums/identity-status.enum';
import { Role } from '@/enums/role.enum';

export interface CreateDriverPayload {
    name: string;
    email: string;
    password: string;
    phone: string;
    vehicleNumber: string;
}

export interface UpdateDriverPayload {
    email?: string;
    name?: string;
    phone?: string;
    vehicleNumber?: string;
}

export interface Driver {
    id: string;
    identityId?: string;
    name: string;
    email: string;
    phone: string;
    vehicleNumber: string;
    dutyStatus: DutyStatus;
    status: IdentityStatus;
    role: Role;
    createdAt?: string;
    updatedAt?: string;
}
export interface DriverLookup {
    id: string;
    name: string;
    dutyStatus: DutyStatus;
}