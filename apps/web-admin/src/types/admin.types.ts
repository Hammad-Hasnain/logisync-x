import { IdentityStatus } from "@/enums/identity-status.enum";
import { Role } from "@/enums/role.enum";

export interface AdminProfile {
    id: string;
    identityId: string;
    name: string;
    email: string;
    roles: Role[];
    status: IdentityStatus;
    phone: string;
}

export interface AdminLoginResponse {
    accessToken: string;
    admin: AdminProfile;
}