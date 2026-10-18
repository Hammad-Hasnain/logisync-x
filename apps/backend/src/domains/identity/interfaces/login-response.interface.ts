import { Role } from 'src/shared/enums/role.enum';
import { IdentityStatus } from 'src/shared/enums/identity-status.enum';
import { DutyStatus } from 'src/shared/enums/duty-status.enum';

// Identity Base Profile 
export interface IdentityBaseProfile {
    email: string;
    phone: string;
    status: IdentityStatus;
    role: Role;
}

// Admin Profile Response 
export interface AdminProfileResponse extends IdentityBaseProfile {
    id: string;
    name: string;
    identityId: string;
    createdAt: Date;
    updatedAt: Date;
}

// Driver Profile Response 
export interface DriverProfileResponse extends IdentityBaseProfile {
    id: string;
    name: string;
    identityId: string;
    vehicleNumber: string;
    dutyStatus: DutyStatus;
    createdAt: Date;
    updatedAt: Date;
}


export type UnifiedUserProfile = AdminProfileResponse | DriverProfileResponse;

export interface LoginResponse {
    accessToken: string;
    user: UnifiedUserProfile;
}
